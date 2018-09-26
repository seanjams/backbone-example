const songTemplate = `
<div style="display:inline-block;">
  <label for="song-title" style="color:#777;">Title</label>
  <div class="song-title" style="width:100px;display:inline-block;"><%= title %></div>
</div>
<div style="display:inline-block;">
  <label for="song-artist" style="color:#777;">Artist</label>
  <div class="song-artist" style="width:100px;display:inline-block;"><%= artist %></div>
</div>
<div style="display:inline-block;">
  <label for="song-album" style="color:#777;">Album</label>
  <div class="song-album" style="width:100px;display:inline-block;"><%= album %></div>
</div>
<button class="edit-song">Edit</button>
<button class="delete-song">Delete</button>
<button class="update-song" style="display:none;">Update</button>
<button class="cancel-song" style="display:none;">Cancel</button>
`;

const Song = Backbone.Model.extend({
	defaults: {
		title: "",
		artist: "",
		album: "",
	},
});

const Album = Backbone.Collection.extend({});

const SongView = Backbone.View.extend({
	model: new Song(),
	tagName: "div",
	events: {
		"click .edit-song": "edit",
		"click .delete-song": "delete",
		"click .update-song": "update",
		"click .cancel-song": "cancel",
	},
	initialize: function() {
		this.template = _.template(songTemplate);
	},
	edit: function() {
		const title = this.$(".song-title").html();
		const artist = this.$(".song-artist").html();
		const album = this.$(".song-album").html();
		this.$(".edit-song").hide();
		this.$(".delete-song").hide();
		this.$(".update-song").show();
		this.$(".cancel-song").show();

		this.$(".song-title").html(
			`<input class="title-update" type="text" style="width:100px;" value="${title}"/>`
		);
		this.$(".song-artist").html(
			`<input class="artist-update" type="text" style="width:100px;" value="${artist}"/>`
		);
		this.$(".song-album").html(
			`<input class="album-update" type="text" style="width:100px;" value="${album}"/>`
		);
	},
	update: function() {
		const title = this.$(".title-update").val();
		const artist = this.$(".artist-update").val();
		const album = this.$(".album-update").val();
		this.model.set({ title, artist, album });
	},
	cancel: function() {
		songsView.render();
	},
	delete: function() {
		this.model.destroy();
	},
	render: function() {
		const temp = this.template(this.model.toJSON());
		this.$el.html(temp);
		return this;
	},
});

const SongsView = Backbone.View.extend({
	model: new Album(),
	el: "#songs-list",
	initialize: function() {
		this.model.on("add", this.render, this);
		this.model.on("change", this.render, this);
		this.model.on("remove", this.render, this);
	},
	render: function() {
		this.$el.html("");
		this.model.toArray().forEach(song => {
			const view = new SongView({ model: song });
			this.$el.append(view.render().$el);
		});
		return this;
	},
});

$(document).ready(() => {
	album = new Album();
	songsView = new SongsView({ model: album });
	$(".add-song").click(() => {
		album.add(
			new Song({
				title: $(".song-title").val(),
				artist: $(".song-artist").val(),
				album: $(".song-album").val(),
			})
		);
	});
});
