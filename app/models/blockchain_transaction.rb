# == Schema Information
#
# Table name: blockchain_transactions
#
#  id         :bigint(8)        not null, primary key
#  trx_hash   :string
#  chain_id   :string
#  contract   :string
#  function   :string
#  from       :string
#  to         :string
#  value      :string
#  message    :string
#  timestamp  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class BlockchainTransaction < ApplicationRecord

end
