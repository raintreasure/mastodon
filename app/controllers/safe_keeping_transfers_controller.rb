class SafeKeepingTransfersController < ApplicationController
  def create
    SafeKeepingTransfer.create!(transfer_params)
  end

  def transfer_params
    params.permit(:account_type, :from, :to, :amount)
  end

  def claim_safe_keeping_transfers(type, email, name, address)
    idtifier = get_identifier(type, email, name)
    transfers = SafeKeepingTransfer.where(account_type: type, to: idtifier)
    total_sum = transfers.sum(:amount)
    transfer_safe_keeping_token(address, total_sum)
    transfers.destroy_all


  end

  def transfer_safe_keeping_token(to, amount)

  end
  def get_identifier(type, email, name)
    case type
    when 'email'
      return email
    when 'twitter'
      return name
    else
      return name
    end
  end
end
