# frozen_string_literal: true

module BrandingHelper
  def logo_as_symbol(version = :icon)
    case version
    when :icon
      _logo_as_symbol_icon
    when :wordmark
      _logo_as_symbol_wordmark
    end
  end

  def _logo_as_symbol_wordmark
    if ENV['REACT_APP_DAO'] === 'chinesedao'
      image_tag('chinese-dark.png', alt: 'chinese.org', class: 'logo .logo--wordmark')
    else
      if ENV['REACT_APP_DAO'] === 'facedao'
        image_tag('face-wordmark-dark.png', alt: 'facedao.com', class: 'logo .logo--wordmark')
      else
        image_tag('chinese-dark.png', alt: 'chinese.org', class: 'logo .logo--wordmark')
      end
    end
  end

  def _logo_as_symbol_icon
    if ENV['REACT_APP_DAO'] === 'chinesedao'
      image_tag('chinese-icon-s.png', alt: 'chinese.org', class: 'logo .logo--icon')
    else
      if ENV['REACT_APP_DAO'] === 'facedao'
        image_tag('face-icon.png', alt: 'facedao.com', class: 'logo .logo--icon')
      else
        image_tag('chinese-icon-s.png', alt: 'chinese.org', class: 'logo .logo--icon')
      end
    end
    # content_tag(:svg, tag(:use, href: '#logo-symbol-icon'), viewBox: '0 0 79 79', class: 'logo logo--icon')
  end

  def render_logo
    if ENV['REACT_APP_DAO'] === 'chinesedao'
      image_pack_tag('chinese-icon-s.png', alt: 'chinese.org', class: 'logo .logo--icon')
    else
      if ENV['REACT_APP_DAO'] === 'facedao'
        image_pack_tag('face-icon.png', alt: 'facedao.com', class: 'logo .logo--icon')
      else
        image_pack_tag('chinese-icon-s.png', alt: 'chinese.org', class: 'logo logo--icon')
      end
    end
  end

  def render_symbol(version = :icon)
    path = case version
           when :icon
             #  'logo-symbol-icon.svg'
             if ENV['REACT_APP_DAO'] === 'chinesedao'
               'chinese-icon-s.png'
             else
               if ENV['REACT_APP_DAO'] === 'facedao'
                 'face-icon.png'
               else
                 'chinese-icon-s.png'
               end
             end
           when :wordmark
             if ENV['REACT_APP_DAO'] === 'chinesedao'
               'chinese-dark.png'
             else
               if ENV['REACT_APP_DAO'] === 'facedao'
                 'face-wordmark-dark.png'
               else
                 'chinese-dark.png'
               end
             end
           end

    render(file: Rails.root.join('app', 'javascript', 'images', path)).html_safe # rubocop:disable Rails/OutputSafety
  end
end
