require 'test_helper'

class UserEntriesControllerTest < ActionController::TestCase
  setup do
    @user_entry = user_entries(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_entries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_entry" do
    assert_difference('UserEntry.count') do
      post :create, user_entry: { name: @user_entry.name, song_id: @user_entry.song_id }
    end

    assert_redirected_to user_entry_path(assigns(:user_entry))
  end

  test "should show user_entry" do
    get :show, id: @user_entry
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_entry
    assert_response :success
  end

  test "should update user_entry" do
    put :update, id: @user_entry, user_entry: { name: @user_entry.name, song_id: @user_entry.song_id }
    assert_redirected_to user_entry_path(assigns(:user_entry))
  end

  test "should destroy user_entry" do
    assert_difference('UserEntry.count', -1) do
      delete :destroy, id: @user_entry
    end

    assert_redirected_to user_entries_path
  end
end
