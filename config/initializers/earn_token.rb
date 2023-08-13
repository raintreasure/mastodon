def getPublishReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    200
  when 'facedao'
    20
  when 'lovedao'
    200
  when 'pqcdao'
    2
  end
end

def getFavouriteReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    100
  when 'facedao'
    10
  when 'lovedao'
    100
  when 'pqcdao'
    1
  end
end

def getBookmarkReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    100
  when 'facedao'
    10
  when 'lovedao'
    100
  when 'pqcdao'
    1
  end
end

def getRetweetReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    100
  when 'facedao'
    10
  when 'lovedao'
    100
  when 'pqcdao'
    1
  end
end

def getFollowReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    100
  when 'facedao'
    10
  when 'lovedao'
    100
  when 'pqcdao'
    1
  end
end

def getOnlineReward
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    0.1
  when 'facedao'
    0.1
  when 'lovedao'
    1
  when 'pqcdao'
    0.01
  end
end

def getDailyRewardLimit
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    10000
  when 'facedao'
    1000
  when 'lovedao'
    10000
  when 'pqcdao'
    100
  end
end

def geInitialBalance
  case ENV['REACT_APP_DAO']
  when 'chinesedao'
    100000
  when 'facedao'
    1000
  when 'lovedao'
    100000
  when 'pqcdao'
    100
  end
end
