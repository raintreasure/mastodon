require 'eth'
require 'colorize'

class BlockchainIndexerController < ApplicationController
  @@init = false

  def get_transactions
    puts('>>>>>>>>>>>>>>>>>>>>>>> get_transactions <<<<<<<<<<<<<<<')
    puts(">>>>>>>>>>>>>>>>>>>>>>> chain_id: #{chain_id} <<<<<<<<<<<")
    puts(">>>>>>>>>>>>>>>>>>>>>>> contract: #{contract_address} <<<<<<<<<<<")
    puts(">>>>>>>>>>>>>>>>>>>>>>> function: #{function_hash} <<<<<<<<<<<")
    puts(">>>>>>>>>>>>>>>>>>>>>>> addr: #{addr} <<<<<<<<<<<")

    transactions = (BlockchainTransaction.where(from: addr).or(BlockchainTransaction.where(to: addr)))
                     .and(BlockchainTransaction.where(chain_id: chain_id, contract: contract_address, function: function_hash))

    render json: transactions, status: 200
  end

  def start
    puts('>>>>>>>>>>>>>>>>>>>>>>>>enter start <<<<<<<<<<<<<<<<<<<<<'.yellow)
    if !@@init
      @@init = true
      puts('>>>>>>>>>>>>>>>>>> start indexing <<<<<<<<<<<<<'.yellow)
      client = Eth::Client.create '/home/root/fusion-node/data/efsn.ipc'
      transfer_data_abi_args_type = %w[address uint256 bytes]
      transfer_data_func_hash = '0xc0e37b15'
      transfer_abi_args_type = %w[address uint256]
      transfer_func_hash = '0xa9059cbb'
      contract_address = '0xf5c5edf98c47bfe3a1d29c7ffe9a93ffc09a9205'
      start_block = 6526255

      while true
        current_block = client.eth_get_block_by_number(start_block, false)
        puts(">>>>>>>>>>>>>>>>>> get new block #{current_block['result']['number']}<<<<<<<<<<<<<".yellow)
        if current_block['result']
          timestamp = current_block['result']['timestamp'].to_i(16).to_s
          tx_num_in_block = client.eth_get_block_transaction_count_by_number(start_block)
          puts(">>>>>>>>>>>>>>>>>>> block transaction num: #{tx_num_in_block}".yellow)
          tx_num = tx_num_in_block['result'][2..].to_i
          for tx_idx in 0..tx_num
            tx = client.eth_get_transaction_by_block_number_and_index(start_block, tx_idx)
            if tx['result']
              puts(">>>>>>>>>>>> get new tx#{tx['result']['hash']}".yellow)
              next unless tx['result'] && (tx['result']['to'] == contract_address)
              input = tx['result']['input']
              hash = tx['result']['hash']
              if input.start_with?(transfer_func_hash)
                puts('>>>>>>>>>>>>>>>>>>>>> start with transfer'.red)
                decoded = Eth::Abi.decode(transfer_abi_args_type, input[10..])
                puts(">>>>>>>>>>>>>>>>>>>>>>>> #{tx['result']['from']} transferred #{decoded[1]}  to #{decoded[0]}".red)
                if !(BlockchainTransaction.where(trx_hash: hash).exists?)
                  BlockchainTransaction.create!(trx_hash: hash, chain_id: "0x7f93", contract: contract_address, function: transfer_func_hash,
                                                from: tx['result']['from'], to: decoded[0], value: decoded[1], message: "", timestamp: timestamp)
                  puts('>>>>>>>>>>>>>>>> saved to db'.red)
                end
              end
              if input.start_with?(transfer_data_func_hash)
                decoded = Eth::Abi.decode(transfer_data_abi_args_type, input[10..])
                puts(">>>>>>>>>>>>>>>>>>>>>>>> #{tx['result']['from']} transferred #{decoded[1]}  to #{decoded[0]} with message #{decoded[2]}".yellow)
                if !(BlockchainTransaction.where(trx_hash: hash).exists?)
                  BlockchainTransaction.create!(trx_hash: hash, chain_id: "0x7f93", contract: contract_address, function: transfer_func_hash,
                                                from: tx['result']['from'], to: decoded[0], value: decoded[1], message: decoded[2], timestamp: timestamp)
                  puts('>>>>>>>>>>>>>>>> saved to db')
                end
              end
            end
          end

          start_block += 1
          puts(">>>>>>>>>>>>>>>>>>>>>>>>>> new block num is #{start_block}".yellow)
        else
          puts('new block hasn\'t been mined yet')
          sleep(1)
        end
      end
    end
    render json: {}, status: 200
  end

  def chain_id
    params[:chain_id]
  end

  def contract_address
    params[:contract]
  end

  def addr
    params[:addr]
  end

end
