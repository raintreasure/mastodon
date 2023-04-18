# == Schema Information
#
# Table name: earn_records
#
#  id         :bigint(8)        not null, primary key
#  account_id :bigint(8)
#  target_id  :bigint(8)
#  op_type    :string
#  earn       :decimal(, )
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class EarnRecord < ApplicationRecord
  belongs_to :account, inverse_of: :earn_records
end
