# frozen_string_literal: true

require 'devise/strategies/base'

module Devise
  module Strategies
    class TwoFactorWeb3authAuthenticatable < Base
      def valid?
        valid_params? && mapping.to.respond_to?(:authenticate_with_web3auth)
      end

      def authenticate!
        resource = mapping.to.authenticate_with_web3auth(params[scope])

        if resource && !resource.otp_required_for_login?
          success!(resource)
        else
          fail(:invalid)
        end
      end

      protected

      def valid_params?
        params[scope]
      end
    end
  end
end

Warden::Strategies.add(:two_factor_web3auth_authenticatable, Devise::Strategies::TwoFactorWeb3authAuthenticatable)










