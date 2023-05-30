class Api::V1::Accounts::EarnRecordsController < Api::BaseController
  before_action :require_user!
  def get_earning_records
    earning_records = EarnRecord.where(account_id: current_account.id)
    render json: { earnings: earning_records }, status: 200
  end

end
