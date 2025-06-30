class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error

  private

  def handle_standard_error(exception)
    Rails.logger.error "StandardError: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")
    
    render json: { 
      status: 'error',
      errors: ['Internal server error'],
      message: exception.message
    }, status: :internal_server_error
  end

  def handle_validation_error(exception)
    Rails.logger.error "ValidationError: #{exception.message}"
    
    render json: { 
      status: 'error',
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end
end
