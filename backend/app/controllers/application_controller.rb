class ApplicationController < ActionController::API
  before_action :log_request_details

  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error

  private

  def log_request_details
    Rails.logger.info "=== Request Details ==="
    Rails.logger.info "Method: #{request.method}"
    Rails.logger.info "URL: #{request.url}"
    Rails.logger.info "Path: #{request.path}"
    Rails.logger.info "Params: #{params.inspect}"
    Rails.logger.info "Headers: #{request.headers.to_h.select { |k, v| k.start_with?('HTTP_') }}"
  end

  def handle_standard_error(exception)
    Rails.logger.error "StandardError: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")

    render json: {
      status: "error",
      errors: [ "Internal server error" ],
      message: exception.message
    }, status: :internal_server_error
  end

  def handle_validation_error(exception)
    Rails.logger.error "ValidationError: #{exception.message}"

    render json: {
      status: "error",
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end
end
