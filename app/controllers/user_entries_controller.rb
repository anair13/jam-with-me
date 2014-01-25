class UserEntriesController < ApplicationController
  # GET /user_entries
  # GET /user_entries.json
  def index
    @user_entries = UserEntry.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @user_entries }
    end
  end

  # GET /user_entries/1
  # GET /user_entries/1.json
  def show
    @user_entry = UserEntry.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user_entry }
    end
  end

  # GET /user_entries/new
  # GET /user_entries/new.json
  def new
    @user_entry = UserEntry.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user_entry }
    end
  end

  # GET /user_entries/1/edit
  def edit
    @user_entry = UserEntry.find(params[:id])
  end

  # POST /user_entries
  # POST /user_entries.json
  def create
    @user_entry = UserEntry.new(params[:user_entry])

    respond_to do |format|
      if @user_entry.save
        format.html { redirect_to @user_entry, notice: 'User entry was successfully created.' }
        format.json { render json: @user_entry, status: :created, location: @user_entry }
      else
        format.html { render action: "new" }
        format.json { render json: @user_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /user_entries/1
  # PUT /user_entries/1.json
  def update
    @user_entry = UserEntry.find(params[:id])

    respond_to do |format|
      if @user_entry.update_attributes(params[:user_entry])
        format.html { redirect_to @user_entry, notice: 'User entry was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_entries/1
  # DELETE /user_entries/1.json
  def destroy
    @user_entry = UserEntry.find(params[:id])
    @user_entry.destroy

    respond_to do |format|
      format.html { redirect_to user_entries_url }
      format.json { head :no_content }
    end
  end
end
