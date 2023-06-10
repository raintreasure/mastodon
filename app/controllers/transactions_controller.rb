require 'eth'
require 'forwardable'
require 'bigdecimal'

class TransactionsController < ApplicationController
  before_action :set_client

  def withdraw
    transfer_native_token
    transfer_earnings
    render json: {}, status: 200
  end

  def set_pol_client
    @client = Eth::Client.create 'https://polygon-rpc.com'
    @client.max_fee_per_gas = 200 * Eth::Unit::GWEI
    @client.max_priority_fee_per_gas = 40 * Eth::Unit::GWEI
  end

  def set_bsc_client
    @client = Eth::Client.create 'https://rpc.ankr.com/bsc'
  end

  def set_client
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      set_pol_client
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      set_bsc_client
    end
  end

  def transfer_native_token
    if !current_account.given_native_token
      begin
        hash = @client.transfer_and_wait(to_address, 0.001 * Eth::Unit::ETHER, sender_key: buffer_account_private_key,
                                         legacy: ENV['REACT_APP_DAO'] == 'facedao' ? true : false)

        if @client.tx_succeeded?(hash)
          current_account.given_native_token = true
          current_account.save!
        end
      rescue StandardError => e
        puts("Error transferring native token: #{e.message}")
      end
    end
  end

  def transfer_earnings
    begin
      current_balance = current_account.balance
      hash = @client.transact_and_wait(erc20_contract, 'transfer', to_address,
                                       BigDecimal(current_balance).mult(ENV['REACT_APP_DAO'] == 'facedao' ? 1 : Eth::Unit::ETHER, 0).round,
                                       sender_key: buffer_account_private_key, gas_limit: 80000,
                                       legacy: ENV['REACT_APP_DAO'] == 'facedao' ? true : false)
      if @client.tx_succeeded?(hash)
        current_account.decrement(:balance, current_balance)
        current_account.save!
      end
    rescue StandardError => e
      puts("Error transferring earnings: #{e.message}, #{e.backtrace}, #{e}")
    end
  end

  def to_address
    params[:to_address]
  end

  def buffer_account_private_key
    Eth::Key.new(priv: ENV['BUFFER_ACCOUNT_PRIVATE_KEY'])
  end

  def contract_address
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return ENV['CHINESE_CONTRACT_ADDRESS']
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return ENV['LOVE_CONTRACT_ADDRESS']
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return ENV['SEXY_CONTRACT_ADDRESS']
    end
  end

  def erc20_contract
    abi_file = File.read('app/assets/contracts/transferABI.json')
    abi = JSON.parse abi_file
    Eth::Contract.from_abi(abi: abi, name:'ERC20Template', address: contract_address)
  end

end
