<?php
/**
 * Checkout Template.
 *
 * @package Tutor\Views
 * @author Themeum <support@themeum.com>
 * @link https://themeum.com
 * @since 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Tutor\Ecommerce\CheckoutController;
use Tutor\Ecommerce\CartController;
use Tutor\Ecommerce\Manager\Checkout;
use TUTOR\Input;

$user_id = get_current_user_id();

$tutor_toc_page_link     = tutor_utils()->get_toc_page_link();
$tutor_privacy_page_link = null; // @TODO: Need to implement later.

$cart_controller = new CartController();
$get_cart        = $cart_controller->get_cart_items();
$courses         = $get_cart['courses'];
$total_count     = $courses['total_count'];
$course_list     = $courses['results'];
$subtotal        = 0;
$tax_amount      = 0; // @TODO: Need to implement later.
$course_ids      = implode( ', ', array_values( array_column( $course_list, 'ID' ) ) );
$plan_id         = Input::get( 'plan', 0, Input::TYPE_INT );

$checkout_manager = Checkout::create_with( $course_list, 'SPECIAL', $get_cart['cart']->user_id, '040' );
$summary          = $checkout_manager->get_calculated_data();
?>
<div class="tutor-checkout-page">

	<?php
	$echo_before_return    = true;
	$user_has_subscription = apply_filters( 'tutor_checkout_user_has_subscription', false, $plan_id, $echo_before_return );
	if ( $user_has_subscription ) {
		return;
	}
	?>

	<form method="post" id="tutor-checkout-form">
		<?php tutor_nonce_field(); ?>
		<input type="hidden" name="tutor_action" value="tutor_pay_now">
		<div class="tutor-row tutor-g-0">
			<div class="tutor-col-md-6">
				<?php
				$file = __DIR__ . '/checkout-details.php';
				if ( file_exists( $file ) ) {
					include $file;
				}
				?>
			</div>
			<div class="tutor-col-md-6">
				<div class="tutor-checkout-billing">
					<div class="tutor-checkout-billing-inner">
						<h5 class="tutor-fs-5 tutor-fw-medium tutor-color-black tutor-mb-24">
							<?php echo esc_html_e( 'Billing Address', 'tutor' ); ?>
						</h5>

						<?php require tutor()->path . 'templates/dashboard/settings/billing-form-fields.php'; ?>

						<h5 class="tutor-fs-5 tutor-fw-medium tutor-color-black tutor-mb-24 tutor-mt-20">
							<?php esc_html_e( 'Payment Method', 'tutor' ); ?>
						</h5>
						<div class="tutor-checkout-payment-options">
							<input type="hidden" name="payment_method">
							<input type="hidden" name="payment_type">
							<?php
							$payment_gateways = tutor_get_all_active_payment_gateways();
							if ( empty( $payment_gateways['automate'] ) && empty( $payment_gateways['manual'] ) ) {
								?>
								<div class="tutor-alert tutor-warning">
									<?php esc_html_e( 'No payment method has been configured. Please contact the site administrator.', 'tutor' ); ?>
								</div>
								<?php
							} else {
								foreach ( $payment_gateways['automate'] as $key => $gateway ) {
									list( $label, $icon ) = array_values( $gateway );
									?>
										<button type="button" data-payment-method="<?php echo esc_attr( $key ); ?>" data-payment-type="automate">
											<img src = "<?php echo esc_url( $icon ); ?>" alt="<?php echo esc_attr( $key ); ?>"/>
											<?php echo esc_html( $label ); ?>
										</button>
									<?php
								}

								// Show manual payment for only regular order.
								if ( ! $plan_id ) {
									foreach ( $payment_gateways['manual'] as $gateway ) {
										list( $label, $additional_details, $payment_instructions ) = array_values( $gateway );
										?>
											<button type="button" data-payment-method="<?php echo esc_attr( $label ); ?>" data-payment-type="manual" data-payment-details="<?php echo esc_attr( $gateway['additional_details'] ); ?>" data-payment-instruction="<?php echo esc_attr( $gateway['payment_instructions'] ); ?>">
												<?php echo esc_html( $label ); ?>
											</button>
										<?php
									}
								} elseif ( empty( $payment_gateways['automate'] ) ) {
									?>
									<div class="tutor-alert tutor-warning">
										<?php esc_html_e( 'No payment method supporting subscriptions has been configured. Please contact the site administrator.', 'tutor' ); ?>
									</div>
									<?php
								}
							}
							?>
						</div>
						<div class="tutor-payment-instructions tutor-d-none"></div>

						<?php if ( null !== $tutor_toc_page_link ) : ?>
							<div class="tutor-mt-40">
								<div class="tutor-form-check tutor-d-flex">
									<input type="checkbox" id="tutor_checkout_agree_to_terms" name="agree_to_terms" class="tutor-form-check-input" required>
									<label for="tutor_checkout_agree_to_terms">
										<span class="tutor-color-subdued tutor-fw-normal">
											<?php esc_html_e( 'I agree with the website\'s', 'tutor' ); ?> 
											<a target="_blank" href="<?php echo esc_url( $tutor_toc_page_link ); ?>" class="tutor-color-primary"><?php esc_html_e( 'Terms of Use', 'tutor' ); ?></a> 
											<?php if ( null !== $tutor_privacy_page_link ) : ?>
												<?php esc_html_e( 'and', 'tutor' ); ?> 
												<a target="_blank" href="<?php echo esc_url( $tutor_privacy_page_link ); ?>" class="tutor-color-primary"><?php esc_html_e( 'Privacy Policy', 'tutor' ); ?></a>
											<?php endif; ?>
										</span>
									</label>
								</div>
							</div>
						<?php endif; ?>

						<!-- handle errors -->
						<?php
						$pay_now_errors    = get_transient( CheckoutController::PAY_NOW_ERROR_TRANSIENT_KEY . $user_id );
						$pay_now_alert_msg = get_transient( CheckoutController::PAY_NOW_ALERT_MSG_TRANSIENT_KEY . $user_id );

						delete_transient( CheckoutController::PAY_NOW_ALERT_MSG_TRANSIENT_KEY . $user_id );
						delete_transient( CheckoutController::PAY_NOW_ERROR_TRANSIENT_KEY . $user_id );
						if ( $pay_now_errors || $pay_now_alert_msg ) :
							?>
						<div class="tutor-mb-32 tutor-break-word">
							<?php
							if ( ! empty( $pay_now_alert_msg ) ) :
								list( $alert, $message ) = array_values( $pay_now_alert_msg );
								?>
								<div class="tutor-alert tutor-<?php echo esc_attr( $alert ); ?>">
									<div class="tutor-color-success"><?php echo esc_html( $message ); ?></div>
								</div>
							<?php endif; ?>

							<?php if ( is_array( $pay_now_errors ) && count( $pay_now_errors ) ) : ?>
							<div class="tutor-alert tutor-danger">
								<ul class="tutor-mb-0">
									<?php foreach ( $pay_now_errors as $pay_now_err ) : ?>
										<li class="tutor-color-danger"><?php echo esc_html( ucfirst( str_replace( '_', ' ', $pay_now_err ) ) ); ?></li>
									<?php endforeach; ?>
								</ul>
							</div>
							<?php endif; ?>
						</div>
						<?php endif; ?>
						<!-- handle errors end -->

						<button type="submit" id="tutor-checkout-pay-now-button" class="tutor-btn tutor-btn-primary tutor-btn-lg tutor-w-100 tutor-justify-center tutor-mt-16">
							<?php esc_html_e( 'Pay Now', 'tutor' ); ?>
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
