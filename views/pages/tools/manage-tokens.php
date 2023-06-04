<?php
/**
 * Tutor pages
 *
 * @package Tutor\Views
 * @author Themeum <support@themeum.com>
 * @link https://themeum.com
 * @since 2.0.0
 */

use Tutor\Helpers\QueryHelper;
use TUTOR\RestAuth;

global $wpdb;

$user_id = get_current_user_id();

// Getting user meta using custom query since get_user_meta .
//not return umeta_id .
$tokens  = QueryHelper::get_all(
	$wpdb->usermeta,
	array(
		'user_id'  => $user_id,
		'meta_key' => RestAuth::KEYS_USER_META_KEY,
	),
	'umeta_id'
);

$permissions = RestAuth::available_permissions();
$user        = get_userdata( get_current_user_id() );

?>

<div class="tutor-rest-api-keys-wrapper">
	<button class="tutor-btn tutor-btn-outline-primary tutor-btn-md tutor-mb-12" data-tutor-modal-target="tutor-add-new-api-keys">
		+ <?php esc_html_e( 'Add New', 'tutor' ); ?>
	</button>

	<table class="tutor-table tutor-pages-table">
		<thead>
			<tr>
				<th><?php esc_html_e( 'User', 'tutor' ); ?></th>
				<th><?php esc_html_e( 'API Key', 'tutor' ); ?></th>
				<th><?php esc_html_e( 'Secret', 'tutor' ); ?></th>
				<th><?php esc_html_e( 'Permission', 'tutor' ); ?></th>
				<th><?php esc_html_e( 'Action', 'tutor' ); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php
			foreach ( $tokens as $token ) {
				$api = json_decode( $token->meta_value );
                echo RestAuth::prepare_response( $token->umeta_id, $api->key, $api->secret, $api->permission ); //phpcs:ignore
			}
			?>
		</tbody>
	</table>
</div>

<!-- add new token modal  -->
<div id="tutor-add-new-api-keys" class="tutor-modal tutor-modal-scrollable">
	<div class="tutor-modal-overlay"></div>
	<div class="tutor-modal-window">
		<form id="tutor-generate-api-keys" class="tutor-modal-content" autocomplete="off" method="post">
			<div class="tutor-modal-header">
				<div class="tutor-modal-title">
					<?php esc_html_e( 'Generate API Key, Secret', 'tutor' ); ?>
				</div>
				<button class="tutor-iconic-btn tutor-modal-close" data-tutor-modal-close>
					<span class="tutor-icon-times" area-hidden="true"></span>
				</button>
			</div>

			<div class="tutor-modal-body">
				<?php tutor_nonce_field(); ?>
				<input type="hidden" name="action" value="tutor_generate_api_keys">
				<div class="tutor-row">
					<div class="tutor-col">
						<label class="tutor-form-label">
							<?php esc_html_e( 'User', 'tutor' ); ?>
						</label>
						<div class="tutor-mb-16">
							<input type="text" class="tutor-form-control" value="<?php echo esc_html( tutor_utils()->display_name( $user->ID ) ); ?>" disabled>
						</div>
					</div>
				</div>
				<div class="tutor-row">
					<div class="tutor-col">
						<label class="tutor-form-label">
							<?php esc_html_e( 'Permission', 'tutor' ); ?>
						</label>
						<div class="tutor-mb-16">
							<select name="permission" class="tutor-form-select">
							   <?php foreach ( $permissions as $permission ) : ?>
								<option value="<?php echo esc_attr( $permission['value'] ); ?>">
									<?php echo esc_html( $permission['label'] ); ?>
								</option>
								<?php endforeach; ?>
							</select>
						</div>
					</div>
				</div>

			</div>

			<div class="tutor-modal-footer">
				<button class="tutor-btn tutor-btn-outline-primary" data-tutor-modal-close>
					<?php esc_html_e( 'Cancel', 'tutor' ); ?>
				</button>

				<button type="submit" class="tutor-btn tutor-btn-primary">
					<?php esc_html_e( 'Generate', 'tutor' ); ?>
				</button>
			</div>
		</form>
	</div>
</div>
