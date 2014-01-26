class Song < ActiveRecord::Base
  attr_accessible :firebase_identifier
  after_create :generate_firebase_identifier

  def age
    (1000.0 * Time.now.to_f).to_i - firebase_identifier[7..-1].to_i
  end

  def frozen
    age() > 1000 * 60 * 1
  end

  private
  def generate_firebase_identifier
    update_attribute(:firebase_identifier, "session" + (1000.0 * Time.now.to_f).to_i.to_s)
  end
end
