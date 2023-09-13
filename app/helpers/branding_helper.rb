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
      image_tag('chinese-wordmark-dark.png', alt: 'chinese.org', class: 'logo logo--wordmark')
    elsif ENV['REACT_APP_DAO'] === 'facedao'
      image_tag('face-wordmark-dark.png', alt: 'facedao.com', class: 'logo logo--wordmark')
    elsif ENV['REACT_APP_DAO'] === 'lovedao'
      image_tag('love-wordmark-dark.png', alt: 'lovedao.com', class: 'logo logo--wordmark')
    elsif ENV['REACT_APP_DAO'] === 'pqcdao'
      image_tag('pqc-wordmark-dark.png', alt: 'pqcdao.com', class: 'logo logo--wordmark')
    elsif ENV['REACT_APP_DAO'] === 'sexydao'
      image_tag('sexy-wordmark-dark.png', alt: 'sexydao.com', class: 'logo logo--wordmark')
    else
      image_tag('chinese-wordmark-dark.png', alt: 'chinese.org', class: 'logo logo--wordmark')
    end
  end

  def _logo_as_symbol_icon
    if ENV['REACT_APP_DAO'] === 'chinesedao'
      image_tag('chinese-icon.png', alt: 'chinese.org', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'facedao'
      image_tag('face-icon.png', alt: 'facedao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'lovedao'
      image_tag('love-icon.png', alt: 'lovedao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'pqcdao'
      image_tag('pqc-icon.png', alt: 'pqcdao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'sexydao'
      image_tag('sexy-icon.png', alt: 'sexydao.com', class: 'logo logo--icon')
    else
      image_tag('chinese-icon.png', alt: 'chinese.org', class: 'logo logo--icon')
    end
    # content_tag(:svg, tag(:use, href: '#logo-symbol-icon'), viewBox: '0 0 79 79', class: 'logo logo--icon')
  end

  def render_logo
    if ENV['REACT_APP_DAO'] === 'chinesedao'
      image_pack_tag('chinese-icon.png', alt: 'chinese.org', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'facedao'
      image_pack_tag('face-icon.png', alt: 'facedao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'lovedao'
      image_pack_tag('love-icon.png', alt: 'lovedao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'pqcdao'
      image_pack_tag('pqc-icon.png', alt: 'pqcdao.com', class: 'logo logo--icon')
    elsif ENV['REACT_APP_DAO'] === 'sexydao'
      image_pack_tag('sexy-icon.png', alt: 'sexydao.com', class: 'logo logo--icon')
    else
      image_pack_tag('chinese-icon.png', alt: 'chinese.org', class: 'logo logo--icon')
    end
  end

  def render_symbol(version = :icon)
    path = case version
           when :icon
             #  'logo-symbol-icon.svg'
             if ENV['REACT_APP_DAO'] === 'chinesedao'
               'chinese-icon.png'
             elsif ENV['REACT_APP_DAO'] === 'facedao'
               'face-icon.png'
             elsif ENV['REACT_APP_DAO'] === 'lovedao'
               'love-icon.png'
             elsif ENV['REACT_APP_DAO'] === 'pqcdao'
               'pqc-icon.png'
             elsif ENV['REACT_APP_DAO'] === 'sexydao'
               'sexy-icon.png'
             else
               'chinese-icon.png'
             end

           when :wordmark
             if ENV['REACT_APP_DAO'] === 'chinesedao'
               'chinese-wordmark-dark.png'
             elsif ENV['REACT_APP_DAO'] === 'facedao'
               'face-wordmark-dark.png'
             elsif ENV['REACT_APP_DAO'] === 'lovedao'
               'love-wordmark-dark.png'
             elsif ENV['REACT_APP_DAO'] === 'pqcdao'
               'pqc-wordmark-dark.png'
             elsif ENV['REACT_APP_DAO'] === 'sexydao'
               'sexy-wordmark-dark.png'
             else
               'chinese-wordmark-dark.png'
             end
           end

    render(file: Rails.root.join('app', 'javascript', 'images', path)).html_safe # rubocop:disable Rails/OutputSafety
  end
end
