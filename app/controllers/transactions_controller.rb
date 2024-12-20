require 'eth'
require 'forwardable'
require 'bigdecimal'

class TransactionsController < ApplicationController
  before_action :set_client

  def withdraw
    if transfer_earnings
      render json: {}, status: 200
    end

    # if transfer_native_token
    #   if transfer_earnings
    #     render json: {}, status: 200
    #   end
    # end
  end
  def set_pol_client
    @client = Eth::Client.create 'https://polygon-rpc.com'
    @client.max_fee_per_gas = 200 * Eth::Unit::GWEI
    @client.max_priority_fee_per_gas = 40 * Eth::Unit::GWEI
  end

  def set_fsn_client
    @client = Eth::Client.create 'https://mainnet.fusionnetwork.io'
    @client.max_fee_per_gas = gas_price.to_i * Eth::Unit::GWEI
  end

  def set_bsc_client
    @client = Eth::Client.create 'https://rpc.ankr.com/bsc'
    @client.max_fee_per_gas = gas_price.to_i * Eth::Unit::GWEI
  end

  def set_client
    case blockchain
    when 'fusion'
      set_fsn_client
    when 'bsc'
      set_bsc_client
    when 'polygon'
      set_pol_client
    else
      set_fsn_client
    end
  end

  def contractName
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return 'FRC759Token'
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return 'FaceDAO'
    end
    if ENV['REACT_APP_DAO'] == 'lovedao'
      return 'ERC20Template'
    end
    if ENV['REACT_APP_DAO'] == 'pqcdao'
      return 'FRC759Token'
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return 'ChaingeWrappedToken'
    end
    return 'FRC759Token';
  end

  def is_legacy
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return true
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return true
    end
    if ENV['REACT_APP_DAO'] == 'lovedao'
      return true
    end
    if ENV['REACT_APP_DAO'] == 'pqcdao'
      return true
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return true
    end
    return true;
  end
  def get_earn_token_decimal
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return 1e18;
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return 1e18;
    end
    if ENV['REACT_APP_DAO'] == 'lovedao'
      return 1;
    end
    if ENV['REACT_APP_DAO'] == 'pqcdao'
      return 1e18;
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return 1e6;
    end
    return 1e18;
  end

  def transfer_native_token
    if !current_account.given_native_token
      begin
        hash = @client.transfer_and_wait(to_address, 0.001 * Eth::Unit::ETHER, sender_key: buffer_account_private_key,
                                         legacy: ENV['REACT_APP_DAO'] == 'facedao' ? true : false)

        if @client.tx_succeeded?(hash)
          current_account.given_native_token = true
          current_account.save!
          return true
        end
      rescue StandardError => e
        puts("Error transferring native token: #{e.message}")
        render json: { error: e.message }, status: 500
        return false
      end
    end
    true
  end

  def transfer_earnings
    begin
      current_balance = current_account.balance
      chain_balance = @client.call(erc20_contract, 'balanceOf', to_address)
      hash = @client.transact_and_wait(erc20_contract, 'transfer', to_address,
                                       BigDecimal(current_balance).mult(get_earn_token_decimal, 0).round,
                                       sender_key: buffer_account_private_key, gas_limit: 80000, legacy: is_legacy)

      sleep(1)
      chain_new_balance = @client.call(erc20_contract, 'balanceOf', to_address)
      # occasionally transact_and_wait will return a nil even the transaction is succeeded, https://github.com/q9f/eth.rb/issues/223 wait for this issue to fix this bug.
      if (hash && @client.tx_succeeded?(hash)) || (hash.nil? && chain_new_balance > chain_balance)
        current_account.decrement(:balance, current_balance)
        current_account.save!
        return true
      end
      render json: { error: "Withdraw transaction failed" }, status: 500
      return false
    rescue StandardError => e
      render json: { error: e.message }, status: 500
      return false
    end
    true
  end

  def to_address
    params[:to_address]
  end

  def blockchain
    params[:blockchain]
  end

  def gas_price
    params[:gas_price]
  end

  def buffer_account_private_key
    Eth::Key.new(priv: ENV['BUFFER_ACCOUNT_PRIVATE_KEY'])
  end

  def contract_address
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return '0x03a6eed53b5dcb0395dfbecf4cbc816dc6f93790'
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return '0xb700597d8425CEd17677Bc68042D7d92764ACF59'
    end
    if ENV['REACT_APP_DAO'] == 'lovedao'
      if blockchain == 'bsc'
        return '0x6452961D566449Fa5364a182B802a32E17F5cc5f'
      end
      if blockchain == 'fusion'
        return '0xf5c5edf98c47bfe3a1d29c7ffe9a93ffc09a9205'
      end
    end
    if ENV['REACT_APP_DAO'] == 'pqcdao'
      return '0xbd9749e4da1fb181ce6e413946cf760dec67b415'
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return '0x05038f190EB986e8Bbfc2708806026174fb4beBe'
    end
  end

  def erc20_contract
    abi_file = File.read('app/assets/contracts/ERC20ABI.json')
    abi = JSON.parse abi_file
    Eth::Contract.from_abi(abi: abi, name: contractName, address: contract_address)
  end

end
