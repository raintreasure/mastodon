# puts "Load Path: #{$LOAD_PATH.join(', ')}"
# puts "Bundler Path: #{Bundler.rubygems.gem_dir}"
require 'logger' # 强制加载Ruby内置Logger类
require 'bundler/setup'

unless ENV.key?('RAILS_ENV')
  STDERR.puts 'ERROR: Missing RAILS_ENV environment variable, please set it to "production", "development", or "test".'
  exit 1
end

ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.
require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
