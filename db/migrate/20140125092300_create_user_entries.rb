class CreateUserEntries < ActiveRecord::Migration
  def change
    create_table :user_entries do |t|
      t.string :name
      t.integer :song_id

      t.timestamps
    end
  end
end
