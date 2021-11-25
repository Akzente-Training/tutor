<?php
/**
 * Template for displaying single course
 *
 * @since v.1.0.0
 *
 * @author Themeum
 * @url https://themeum.com
 *
 * @package TutorLMS/Templates
 * @version 1.4.3
 */

// Prepare the nav items
$course_nav_item = apply_filters( 'tutor_course/single/nav_items', array(
    'info' => array( 
        'title' => __('Course Info', 'tutor'), 
        'method' => 'tutor_course_info_tab'
    ),
    'curriculum' => array( 
        'title' => __('Curriculum', 'tutor'), 
        'method' => 'tutor_course_topics' 
    ),
    'reviews' => array( 
        'title' => __('Reviews', 'tutor'), 
        'method' => 'tutor_course_target_reviews_html' 
    ),
    'questions' => array( 
        'title' => __('Q&A', 'tutor'), 
        'method' => 'tutor_course_question_and_answer',
        'require_enrolment' => true
    ),
    'announcements' => array( 
        'title' => __('Announcements', 'tutor'), 
        'method' => 'tutor_course_announcements',
        'require_enrolment' => true
    ),
), get_the_ID());

get_header();
do_action('tutor_course/single/before/wrap'); 
?>
<div <?php tutor_post_class('tutor-full-width-course-top tutor-course-top-info tutor-page-wrap'); ?>>
    <div class="tutor-course-details-page tutor-bs-container">
        <?php (isset($is_enrolled) && $is_enrolled) ? tutor_course_enrolled_lead_info() : tutor_course_lead_info(); ?>
        <div class="tutor-single-course-wrapper- tutor-course-details-page-main">
            <div class="tutor-course-details-page-main-left">
                <?php tutor_utils()->has_video_in_single() ? tutor_course_video() : get_tutor_course_thumbnail(); ?>
	            <?php do_action('tutor_course/single/before/inner-wrap'); ?>
                <div class="tutor-default-tab tutor-course-details-tab tutor-tab-has-seemore tutor-mt-30">
                    <?php tutor_load_template( 'single.course.enrolled.nav', array('course_nav_item' => $course_nav_item ) ); ?>
                    <div class="tab-body">
                        <?php 
                            foreach($course_nav_item as $key=>$subpage) {
                                ?>
                                <div class="tab-body-item <?php echo $key=='info' ? 'is-active' : ''; ?>" id="tutor-course-details-tab-<?php echo $key; ?>">
                                    <?php
                                        $method = $subpage['method'];
                                        if(is_string($method)) {
                                            $method();
                                        } else {
                                            $_object = $method[0];
                                            $_method = $method[1];
                                            $_object->$_method(get_the_ID());
                                        }
                                    ?>
                                </div>
                                <?php
                            }
                        ?>
                    </div>
                </div>
	            <?php do_action('tutor_course/single/after/inner-wrap'); ?>
            </div>
            <div class="tutor-course-details-page-main-right">
                <div class="tutor-single-course-sidebar">
                    <?php do_action('tutor_course/single/before/sidebar'); ?>
                    <?php tutor_load_template('single.course.course-entry-box'); ?>
                    <?php tutor_course_requirements_html(); ?>
                    <?php tutor_course_tags_html(); ?>
                    <?php tutor_course_target_audience_html(); ?>
                    <?php do_action('tutor_course/single/after/sidebar'); ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php do_action('tutor_course/single/after/wrap'); ?>

<?php
get_footer();
