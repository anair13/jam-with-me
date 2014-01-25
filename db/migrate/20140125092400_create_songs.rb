class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :firebase_identifier

      t.timestamps
    end
  end
end
