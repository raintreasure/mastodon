# frozen_string_literal: true
require 'jwt'
require 'net/http'
require 'uri'
module Web3Authenticatable
  extend ActiveSupport::Concern

  class_methods do
    def authenticate_with_web3auth(params = {})
      if params[:web3auth_address].blank?
        return
      end

      if verify_jwt(params[:web3auth_id_token], params[:web3auth_address], params[:web3auth_pubkey])
        web3auth_get_user(params[:web3auth_address], params[:email], params[:display_name], params[:img_url])
      end
    end

    def verify_jwt(idToken = '', address = '', pubkey = '')
      # wallet login: pubkey is blank
      if !pubkey.blank?
        uri = URI.parse("https://api.openlogin.com/jwks");
      else
        uri = URI.parse("https://authjs.web3auth.io/jwks");
      end
      response = Net::HTTP.get_response uri
      remote_jwkSet = JSON.parse(response.body);
      decoded = JWT.decode(idToken, nil, true, { algorithms: 'ES256', jwks: remote_jwkSet });

      if !pubkey.blank?
        jwtPubkey = decoded[0]['wallets'][0]['public_key'];
        if !pubkey.blank? && jwtPubkey.downcase === pubkey.downcase
          return true
        end
      else
        jwtAddr = decoded[0]['wallets'][0]['address'];
        if !address.blank? && jwtAddr.downcase === address.downcase
          return true
        end
      end
      # if !pubkey.blank? && jwtAddr.downcase === pubkey.downcase
      #   return true
      # end
      # if !address.blank? && jwtAddr.downcase === address.downcase
      #   return true
      # end

      false
    end

    def web3auth_get_user(address = '', email = '', name = '', img = '')
      # safe_username = attributes[Devise.ldap_uid.to_sym].first
      resource = joins(:account).find_by(accounts: { eth_address: address })
      if resource.blank?
        resource = new(email: email != '' ? email : (address + '@web3.com'), agreement: true,
                       account_attributes: { username: address[21...50], display_name: name,avatar_remote_url: img, eth_address: address, balance: geInitialBalance }, admin: false, external: true,
                       confirmed_at: Time.now.utc)
        resource.save!
      end

      resource
    end
  end
end
