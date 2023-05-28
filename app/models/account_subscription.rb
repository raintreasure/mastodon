# == Schema Information
#
# Table name: account_subscriptions
#
#  id                :bigint(8)        not null, primary key
#  account_id        :bigint(8)        not null
#  target_account_id :bigint(8)        not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class AccountSubscription < ApplicationRecord
  belongs_to :account
  belongs_to :target_account, class_name: 'Account'

end
