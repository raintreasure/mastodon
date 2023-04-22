require 'eth'
require 'forwardable'
require 'bigdecimal'

class TransactionsController < ApplicationController
  before_action :set_client
  before_action :chinese_contract

  def withdraw
    transfer_fsn
    transfer_chinese
    render json: {}, status: 200
  end

  def set_client
    @client = Eth::Client.create 'https://mainnet.fusionnetwork.io'
  end

  def transfer_fsn
    if !current_account.given_fsn
      begin
        hash = @client.transfer_and_wait(to_address, 0.01 * Eth::Unit::ETHER, sender_key: buffer_account_private_key)
        if @client.tx_mined?(hash)
          current_account.given_fsn = true
          current_account.save!
        end
      rescue StandardError => e
        render json: { error: "Error transferring fsn: #{e.message}" }, status: 500
      end
    end
  end

  def transfer_chinese
    begin
      current_balance = current_account.balance
      hash = @client.transact_and_wait(chinese_contract, 'transfer', to_address,
                                       BigDecimal(current_balance).mult(Eth::Unit::ETHER, 0),
                                       sender_key: buffer_account_private_key, gas_limit: 80000)
      if @client.tx_mined?(hash)
        current_account.decrement(:balance, current_balance)
        current_account.save!
      end
    rescue StandardError => e
      render json: { error: "Error transferring fsn: #{e.message}" }, status: 500
    end
  end

  def to_address
    params[:to_address]
  end

  def buffer_account_private_key
    Eth::Key.new(priv: ENV['BUFFER_ACCOUNT_PRIVATE_KEY'])
  end

  def contract_address
    ENV['CHINESE_CONTRACT_ADDRESS']
  end

  def chinese_contract
    abi_file = File.read "app/assets/contracts/chinese.json"
    abi = JSON.parse abi_file
    Eth::Contract.from_abi(abi: abi, name: "FRC759Token", address: contract_address)
  end

end
