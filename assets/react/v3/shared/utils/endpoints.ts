const endpoints = {
  ADMIN_AJAX: 'wp-admin/admin-ajax.php',
  TAGS: 'course-tag',
  CATEGORIES: 'course-category',
  USERS: 'users',
  USERS_LIST: 'tutor_user_list',
  ORDER_DETAILS: 'tutor_order_details',
  ADMIN_COMMENT: 'tutor_order_comment',
  ORDER_MARK_AS_PAID: 'tutor_order_paid',
  ORDER_REFUND: 'tutor_order_refund',
  ORDER_CANCEL: 'tutor_order_cancel',
  ADD_ORDER_DISCOUNT: 'tutor_order_discount',
  COURSE_LIST: 'course_list',
  CATEGORY_LIST: 'category_list',
  CREATED_COURSE: 'tutor_create_course',
  TUTOR_INSTRUCTOR_SEARCH: 'tutor_course_instructor_search',
  GET_SUBSCRIPTIONS_LIST: 'tutor_subscription_course_plans',
  SAVE_SUBSCRIPTION: 'tutor_subscription_course_plan_save',
  DELETE_SUBSCRIPTION: 'tutor_subscription_course_plan_delete',
  DUPLICATE_SUBSCRIPTION: 'tutor_subscription_course_plan_duplicate',
  SORT_SUBSCRIPTION: 'tutor_subscription_course_plan_sort',
  TUTOR_YOUTUBE_VIDEO_DURATION: 'tutor_youtube_video_duration',
  TUTOR_UNLINK_PAGE_BUILDER: 'tutor_unlink_page_builder',

  GENERATE_AI_IMAGE: 'tutor_pro_generate_image',
  MAGIC_FILL_AI_IMAGE: 'tutor_pro_magic_fill_image',
  MAGIC_TEXT_GENERATION: 'tutor_pro_generate_text_content',
  MAGIC_AI_MODIFY_CONTENT: 'tutor_pro_modify_text_content',
  USE_AI_GENERATED_IMAGE: 'tutor_pro_use_magic_image',
  OPEN_AI_SAVE_SETTINGS: 'tutor_pro_chatgpt_save_settings',

  GENERATE_COURSE_CONTENT: 'tutor_pro_generate_course_content',
  GENERATE_COURSE_TOPIC_CONTENT: 'tutor_pro_generate_course_topic_content',
  SAVE_AI_GENERATED_COURSE_CONTENT: 'tutor_pro_ai_course_create',
  GENERATE_QUIZ_QUESTIONS: 'tutor_pro_generate_quiz_questions',

  // Quiz
  SAVE_QUIZ: 'tutor_quiz_builder_save',

  // TAX SETTINGS
  GET_TAX_SETTINGS: 'tutor_get_tax_settings',
  GET_H5P_QUIZ_CONTENT: 'tutor_h5p_list_quiz_contents',
  GET_H5P_LESSON_CONTENT: 'tutor_h5p_list_lesson_contents',
  GET_H5P_QUIZ_CONTENT_BY_ID: 'tutor_h5p_quiz_content_by_id',

  // PAYMENT SETTINGS
  GET_PAYMENT_SETTINGS: 'tutor_payment_settings',
  GET_PAYMENT_GATEWAYS: 'tutor_payment_gateways',
  INSTALL_PAYMENT_GATEWAY: 'tutor_install_payment_gateway',
  REMOVE_PAYMENT_GATEWAY: 'tutor_remove_payment_gateway',
};

export default endpoints;
