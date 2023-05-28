class AccountSubscribeController < ApplicationController

  def target_account_id
    params[:target_account]
  end
  def current_account_id
    current_account.id
  end

end
