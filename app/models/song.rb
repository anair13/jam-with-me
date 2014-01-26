class Song < ActiveRecord::Base
  attr_accessible :firebase_identifier
  after_create :generate_firebase_identifier

  def age
    puts (1000.0 * Time.now.to_f).to_i - :firebase_identifier[7..:firebase_identifier.size].to_i
    (1000.0 * Time.now.to_f).to_i - :firebase_identifier[7..:firebase_identifier.size].to_i
  end

  def frozen
    age() > 1000 * 60 * 1
  end

  private
  def generate_firebase_identifier
    update_attribute(:firebase_identifier, "session" + (1000.0 * Time.now.to_f).to_i.to_s)
  end
end
