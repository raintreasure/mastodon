# frozen_string_literal: true

class REST::InstanceSerializer < ActiveModel::Serializer
  class ContactSerializer < ActiveModel::Serializer
    attributes :email

    has_one :account, serializer: REST::AccountSerializer
  end

  include RoutingHelper

  attributes :domain, :title, :version, :source_url, :description,
             :usage, :thumbnail, :languages, :configuration,
             :registrations

  has_one :contact, serializer: ContactSerializer
  has_many :rules, serializer: REST::RuleSerializer
  def thumbnailFilePath
    if ENV['REACT_APP_DAO'] == 'chinesedao'
      return 'media/images/preview-chinese.png'
    end
    if ENV['REACT_APP_DAO'] == 'facedao'
      return 'media/images/preview-face.png'
    end
    if ENV['REACT_APP_DAO'] == 'lovedao'
      return 'media/images/preview-love.jpg'
    end
    if ENV['REACT_APP_DAO'] == 'pqcdao'
      return 'media/images/preview-pqc.jpg'
    end
    if ENV['REACT_APP_DAO'] == 'sexydao'
      return 'media/images/preview-sexy.webp'
    end
  end
  def thumbnail

    if object.thumbnail
      {
        url: full_asset_url(object.thumbnail.file.url(:'@1x')),
        blurhash: object.thumbnail.blurhash,
        versions: {
          '@1x': full_asset_url(object.thumbnail.file.url(:'@1x')),
          '@2x': full_asset_url(object.thumbnail.file.url(:'@2x')),
        },
      }
    else
      {
        url: full_pack_url(thumbnailFilePath),
      }
    end
  end

  def usage
    {
      users: {
        active_month: object.active_user_count(4),
      },
    }
  end

  def configuration
    {
      urls: {
        streaming: Rails.configuration.x.streaming_api_base_url,
        status: object.status_page_url,
      },

      accounts: {
        max_featured_tags: FeaturedTag::LIMIT,
      },

      statuses: {
        max_characters: StatusLengthValidator::MAX_CHARS,
        max_media_attachments: 4,
        characters_reserved_per_url: StatusLengthValidator::URL_PLACEHOLDER_CHARS,
      },

      media_attachments: {
        supported_mime_types: MediaAttachment::IMAGE_MIME_TYPES + MediaAttachment::VIDEO_MIME_TYPES + MediaAttachment::AUDIO_MIME_TYPES,
        image_size_limit: MediaAttachment::IMAGE_LIMIT,
        image_matrix_limit: Attachmentable::MAX_MATRIX_LIMIT,
        video_size_limit: MediaAttachment::VIDEO_LIMIT,
        video_frame_rate_limit: MediaAttachment::MAX_VIDEO_FRAME_RATE,
        video_matrix_limit: MediaAttachment::MAX_VIDEO_MATRIX_LIMIT,
      },

      polls: {
        max_options: PollValidator::MAX_OPTIONS,
        max_characters_per_option: PollValidator::MAX_OPTION_CHARS,
        min_expiration: PollValidator::MIN_EXPIRATION,
        max_expiration: PollValidator::MAX_EXPIRATION,
      },

      translation: {
        enabled: TranslationService.configured?,
      },
    }
  end

  def registrations
    {
      enabled: registrations_enabled?,
      approval_required: Setting.registrations_mode == 'approved',
      message: registrations_enabled? ? nil : registrations_message,
      url: ENV.fetch('SSO_ACCOUNT_SIGN_UP', nil),
    }
  end

  private

  def registrations_enabled?
    Setting.registrations_mode != 'none' && !Rails.configuration.x.single_user_mode
  end

  def registrations_message
    markdown.render(Setting.closed_registrations_message) if Setting.closed_registrations_message.present?
  end

  def markdown
    @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, no_images: true)
  end
end
