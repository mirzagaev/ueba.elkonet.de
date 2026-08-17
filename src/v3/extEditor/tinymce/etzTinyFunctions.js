top.dialog = new Ego_Dialog();
function tiny_ego_browser(field_name, url, type, win)
{
	var file = conf.cms_dir+'site/'+conf.site+'/v3/extEditor/tinymce/browser.php'
	var params = 'type='+type+'&site='+conf.media+'&list='+conf.startId+'&startId='+conf.startId+'&lang='+conf.lang+'&session[change_site]=0&session[insert_flag]=2&view=multimedia&session[wysiwyg_insert]=1&session[view_type]=list'+(type == 'image mime_type' ? '&session[insert_mime_type]=^image' : '');
	var width = 900;
	var height = 600;

	// Versuchen in der Sitemap direkt eine Seite auszuwÃ¤hlen
	if (m = url.match(/[\?&]site=([^&#]+)/i))
	{
		params = params.replace(/&site=[^&#]+/i, '').replace(/\?site=[^&#]+/i, '?');
		params += '&site='+m[1];
	}

	if (m = url.match(/[\?&]lang=([^&#]+)/i))
	{
		params = params.replace(/&lang=[^&#]+/i, '').replace(/\?lang=[^&#]+/i, '?');
		params += '&lang='+m[1];
	}

	if (m = url.match(/[\?&]id=(\d+)/i))
	{
		params = params.replace(/&id=\d+/i, '').replace(/\?id=\d+/i, '?');
		params += '&list='+m[1];
	}

	params += '&session[tiny_mce_popup]=1';

	tinyMCE.activeEditor.windowManager.open({
		file : file+'?'+params.replace(/^&/, ''),
		title : 'EGOTEC - Sitemap',
		width : width,
		height : height,
		resizable : 'yes',
		inline : 'yes',
		close_previous : 'no'
	},
	{
		window : win,
		input : field_name
	});

	return false;
}