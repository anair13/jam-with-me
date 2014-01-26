class Song < ActiveRecord::Base
  attr_accessible :firebase_identifier
  after_create :generate_firebase_identifier

  private
  def generate_firebase_identifier
    update_attribute(:firebase_identifier, "session" + (1000.0 * Time.now.to_f).to_i.to_s)
  end
end
