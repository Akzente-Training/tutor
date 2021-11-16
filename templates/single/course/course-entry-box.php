<?php 
    // Utillity data
    $is_enrolled           = tutor_utils()->is_enrolled();
    $lesson_url            = tutor_utils()->get_course_first_lesson();
    $is_administrator      = tutor_utils()->has_user_role('administrator');
    $is_instructor         = tutor_utils()->is_instructor_of_this_course();
    $course_content_access = (bool) get_tutor_option('course_content_access_for_ia');
    $is_privileged_user    = $course_content_access && ($is_administrator || $is_instructor);
    $tutor_course_sell_by  = apply_filters('tutor_course_sell_by', null);
    $is_public             = get_post_meta( get_the_ID(), '_tutor_is_public_course', true )=='yes';

    // Monetization info
    $monetize_by = tutor_utils()->get_option('monetize_by');
    $enable_guest_course_cart = tutor_utils()->get_option('enable_guest_course_cart');
    $is_purchasable = tutor_utils()->is_course_purchasable();
    
    // Get login url if 
    $is_tutor_login_disabled = tutor_utils()->get_option('disable_tutor_native_login');
    $auth_url = $is_tutor_login_disabled ? isset( $_SERVER['REQUEST_SCHEME'] ) ? wp_login_url( $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) : '' : '';

    // Right sidebar meta data
    $sidebar_meta = apply_filters( 'tutor/course/single/sidebar/metadata', array(
        array(
            'icon_class' => 'ttr-level-line', 
            'label' => __('Level', 'tutor'), 
            'value' => get_tutor_course_level(get_the_ID())
        ),
        array(
            'icon_class' => 'ttr-student-line-1', 
            'label' => __('Total Enrolled', 'tutor'), 
            'value' => !get_tutor_option('disable_course_total_enrolled') ? tutor_utils()->count_enrolled_users_by_course() : null
        ),
        array(
            'icon_class' => 'ttr-clock-filled', 
            'label' => __('Duration', 'tutor'), 
            'value' => !get_tutor_option('disable_course_duration') ? get_tutor_course_duration_context() : null
        ),
        array(
            'icon_class' => 'ttr-student-line-1', 
            'label' => __('Last Updated', 'tutor'), 
            'value' => !get_tutor_option('disable_course_update_date') ? get_tutor_course_duration_context() : null
        ),
    ), get_the_ID());
?>

<div class="tutor-course-sidebar-card">
    <!-- Course Entry -->
    <div class="tutor-course-sidebar-card-body tutor-p-30">
        <?php 
            if($is_enrolled) {
                // The user is enrolled anyway. No matter manual, free, purchased, woocommerce, edd, membership
                do_action('tutor_course/single/actions_btn_group/before');
                
                // Course Info
                $completed_lessons  = tutor_utils()->get_completed_lesson_count_by_course();
                $completed_percent  = tutor_utils()->get_course_completed_percent();
                $is_completed_course= tutor_utils()->is_completed_course();
                $retake_course      = tutor_utils()->get_option('course_retake_feature', false) && ($is_completed_course || $completed_percent >= 100);

                // Show Start/Continue/Retake Button
                if ( $lesson_url ) { 
                    $button_class = 'tutor-is-fullwidth tutor-btn '.($retake_course ? 'tutor-btn-tertiary tutor-is-outline tutor-btn-lg tutor-btn-full' : '').' tutor-is-fullwidth tutor-pr-0 tutor-pl-0 ' . ($retake_course ? ' tutor-course-retake-button' : '');
                    ?>
                    <a href="<?php echo $lesson_url; ?>" class="<?php echo $button_class; ?>" data-course_id="<?php echo get_the_ID(); ?>">
                        <?php
                            if(is_single_course() && $retake_course) {
                                _e( 'Retake This Course', 'tutor' );
                            } else if( $completed_percent <= 0 ){
                                _e( 'Start Learning', 'tutor' );
                            } else {
                                _e( 'Continue Learning', 'tutor' );
                            }
                        ?>
                    </a>
                    <?php 
                } else {
                    // Show Only enrolled message if there is no content to start from
                    ?>
                    <div class="text-regular-caption color-text-hints tutor-mt-12 tutor-bs-d-flex tutor-bs-align-items-center tutor-bs-justify-content-center">
                        <span class="tutor-icon-26 color-success ttr-purchase-filled tutor-mr-6 "></span> &nbsp;
                        <?php echo sprintf(__('You enrolled this course on %s', 'tutor'), '<span class="text-bold-small color-success tutor-ml-3">'.date_format($is_enrolled->post_date, get_option( 'date_format' )).'</span>'); ?>
                    </div>
                    <?php
                }

                // Show Course Completion Button
                if ( ! $is_completed_course) {
                    ?>
                    <form method="post">
                        <?php wp_nonce_field( tutor()->nonce_action, tutor()->nonce ); ?>

                        <input type="hidden" value="<?php echo get_the_ID(); ?>" name="course_id"/>
                        <input type="hidden" value="tutor_complete_course" name="tutor_action"/>

                        <button type="submit" class="tutor-mt-25 tutor-btn tutor-btn-tertiary tutor-is-outline tutor-btn-lg tutor-btn-full" name="complete_course_btn" value="complete_course">
                            <?php _e( 'Complete Course', 'tutor' ); ?>
                        </button>
                    </form>
                    <?php
                }
                do_action('tutor_course/single/actions_btn_group/after'); 

            } else if($is_privileged_user) {
                // The user is not enrolled but privileged to access course content
                if($lesson_url) {
                    ?>
                    <a href="<?php echo $lesson_url; ?>" class="tutor-mt-5 tutor-mb-5 tutor-is-fullwidth tutor-btn">
                        <?php _e('Continue Lesson', 'tutor'); ?>
                    </a>
                    <?php
                } else {
                    echo _e('No Content to Access', 'tutor');
                }
            } else {
                // The course enroll options like purchase or free enrolment
                $price = apply_filters('get_tutor_course_price', null, get_the_ID());

                if(tutor_utils()->is_course_fully_booked(null)) {
                    ?>
                    <div class="tutor-alert tutor-warning tutor-mt-28">
                        <div class="tutor-alert-text">
                            <span class="tutor-alert-icon tutor-icon-34 ttr-circle-outline-info-filled tutor-mr-10"></span>
                            <span>
                                <?php _e('This course is full right now. We limit the number of students to create an optimized and productive group dynamic.', 'tutor'); ?>
                            </span>
                        </div>
                    </div>
                    <?php
                } else if ($is_purchasable && $price) {
                    $btn_class = is_user_logged_in() ? '' : 'tutor-enrol-require-auth';

                    if ($tutor_course_sell_by){
                        // Load template based on monetization option
                        tutor_load_template('single.course.add-to-cart-'.$tutor_course_sell_by, array('button_class' => $btn_class));
                    } else if ($is_public) {
                        // Get the first content url
                        $first_lesson_url = tutor_utils()->get_course_first_lesson(get_the_ID(), tutor()->lesson_post_type);
                        !$first_lesson_url ? $first_lesson_url = tutor_utils()->get_course_first_lesson(get_the_ID()) : 0;
            
                        ?>
                        <a href="<?php echo $first_lesson_url; ?>" class="tutor-btn tutor-btn-primary tutor-btn-lg tutor-btn-full">
                            <?php _e('Start Learning', 'tutor'); ?>
                        </a>
                        <?php
                    } 
                } else {
                    ?>
                    <div class="tutor-course-sidebar-card-pricing tutor-bs-d-flex align-items-end tutor-bs-justify-content-between">
                        <div>
                            <span class="text-bold-h4 color-text-primary"><?php _e('Free', 'tutor'); ?></span>
                        </div>
                    </div>
                    <div class="tutor-course-sidebar-card-btns">
                        <form class="tutor-enrol-course-form" method="post">
                            <?php wp_nonce_field( tutor()->nonce_action, tutor()->nonce ); ?>
                            <input type="hidden" name="tutor_course_id" value="<?php echo get_the_ID(); ?>">
                            <input type="hidden" name="tutor_course_action" value="_tutor_course_enroll_now">
                            <button type="submit" class="tutor-btn tutor-btn-primary tutor-btn-lg tutor-btn-full tutor-mt-24 <?php echo $btn_class; ?>">
                                <?php _e('Enroll Course', 'tutor'); ?>
                            </button>
                        </form>
                    </div>
                    <div class="text-regular-caption color-text-hints tutor-mt-12 tutor-text-center">
                        <?php _e('Free acess this course', 'tutor'); ?>
                    </div>
                    <?php
                }
            }
        ?>
    </div>

    <!-- Course Info -->
    <div class="tutor-course-sidebar-card-footer tutor-p-30">
        <ul class="tutor-course-sidebar-card-meta-list tutor-m-0">
            <?php foreach($sidebar_meta as $meta): ?>
                <?php if(!$meta['value']) continue; ?>
                <li class="tutor-bs-d-flex tutor-bs-align-items-center tutor-bs-justify-content-between">
                    <div class="flex-center">
                        <span class="tutor-icon-24 <?php echo $meta['icon_class']; ?> color-text-primary"></span>
                        <span class="text-regular-caption color-text-hints tutor-ml-5">
                            <?php echo $meta['label']; ?>
                        </span>
                    </div>
                    <div>
                        <span class="text-medium-caption color-text-primary">
                            <?php echo $meta['value']; ?>
                        </span>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</div>

<?php if(!is_user_logged_in()): ?>
    <div class="tutor-login-modal tutor-modal tutor-is-sm">
        <span class="tutor-modal-overlay"></span>
        <button data-tutor-modal-close class="tutor-modal-close">
            <span class="las la-times"></span>
        </button>
        <div class="tutor-modal-root">
            <div class="tutor-modal-inner">
                <div class="tutor-modal-body">
                    <h3 class="tutor-modal-title tutor-mb-30">Hi, Welcome back!</h3>
                    <form action="#">
                        <div class="tutor-input-group tutor-form-control-has-icon-right tutor-mb-20">
                            <input type="text" class="tutor-form-control" placeholder="Username or Email Id"/>
                        </div>
                        <div class="tutor-input-group tutor-form-control-has-icon-right tutor-mb-30">
                            <input type="password" class="tutor-form-control" placeholder="Password"/>
                        </div>
                        <div class="row align-items-center tutor-mb-30">
                            <div class="col">
                            <div class="tutor-form-check">
                                <input id="login-agmnt-1" type="checkbox" class="tutor-form-check-input" name="login-agmnt-1" />
                                <label htmlFor="login-agmnt-1">Keep me signed in</label>
                            </div>
                            </div>
                            <div class="col-auto">
                                <a href="#">Forgot?</a>
                            </div>
                        </div>
                        <button type="submit" class="tutor-btn is-primary tutor-is-block">
                            Sign In
                        </button>
                        <div class="tutor-text-center tutor-mt-15">
                            Don’t have an account? <a href="#">Registration Now</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>