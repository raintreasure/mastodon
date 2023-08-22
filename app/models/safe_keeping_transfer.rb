# == Schema Information
#
# Table name: safe_keeping_transfers
#
#  id           :bigint(8)        not null, primary key
#  account_type :string
#  to           :string
#  amount       :string
#  from         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class SafeKeepingTransfer < ApplicationRecord
end
