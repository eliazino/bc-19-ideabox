module.exports = {
	errorM : function (str){
		nString = '<br/><div style="color:#ED050B; font-size:15px; background:#F9B4B0; border-left:#ED050B thick solid; padding:15px; width:100%" align="center"><i class="fa fa-warning"></i> '+str+' </div>';
		return nString;
	},
	succesM : function (str){
		nString = '<br/><div style="color:#2B8E11; font-size:15px; background:#BCF8AD; border-left:#2B8E11 thick solid; padding:15px; width:100%" align="center"><i class="fa fa-check-square-o"></i> '+str+'</div>';
		return nString;
	},
	commentBlueprint: function(obj){
		var outstr = '';
		i = 0;
		while (i < obj.length) {
			avatar = '';
			if(obj[i].avatar === '') { avatar = 'avatar/dude.png'} else{ avatar = obj[i].avatar}
			a = '<div style="background:#FDFDFD; padding:6px; border-bottom:#E5E5E5 thin solid">';
    		b = '<div><img src="'+avatar+'" alt="Olaniyan Elias Akinola">';
    		c = '<span class="udesc" style=" font-weight:bold; padding-left:12px; color:#0E5F76">'+obj[i].surname+' '+obj[i].firstname+' </span></div>';
    		d = '<div style="padding:5px"> '+ obj[i].comment+'</div>';
    		e = '<div style="padding:4px; font-size:12px; font-weight:bold" align="right"><span id="cvh'+obj[i].cid+'">';
    		f =  obj[i].helpful+'</span> voted <span style="color:#0A701C; cursor:pointer" onclick="cvote(true,'+obj[i].cid+')">';
    		g = '<i class="fa fa-arrow-up"></i> Helpful</span><span style="padding-left:50px; padding-right:50px;"> | </span><span id="cvu'+obj[i].cid+'">';
    		h = obj[i].unhelpful+'</span> voted <span style="color:#F00; cursor:pointer" onclick="cvote(false,'+obj[i].cid+')"><i class="fa fa-arrow-down"></i> Unhelpful</span>';
    		ij = '</div></div><br />';
    		cstr = a + b + c + d + e + f + g + h + ij;
    		outstr = outstr +''+cstr;
    		//console.log(i);
    		i++;
		}
		return outstr;
	}
};
timer = function(tstr){
	ret = "";
	pass_time = Math.floor(new Date() / 1000) - tstr;
	if(pass_time < 2){
		ret = "<i class='fa fa-clock-o'></i> about a second ago";
	}
	else if(pass_time > 1 && pass_time < 60){
		ret = "<i class='fa fa-clock-o'></i> less than a minute ago";
	}
	else{
		r = Math.ceil(pass_time/60);
		if (r >= 1 && r < 60)
		{
			// within a minute;
			if (r > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+r+" minutes ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a minute ago";
			}
		}
		else if(r >= 60 && r < 1440)
		{
			// within an hour
			if((r/60) > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+Math.ceil(r/60)+" hours ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a hour ago";
			}
		}
		else if(r >= 1440 && r < 10080)
		{
			//within a day
			if((r/1440) > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+Math.ceil(r/1440)+" days ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a day ago";
			}
		}
		else if(r >= 10080 && r < 40320)
		{
			//within a week
			if((r/10080) > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+Math.ceil(r/10080)+" weeks ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a week ago";
			}
		}
		else if (r >= 40320 && r < 483840)
		{
			//within a month
			if((r/40320) > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+Math.ceil(r/40320)+" months ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a month ago";
			}
		}
		else
		{
			//within a year;
			if((r/483840) > 1)
			{
				ret = "<i class='fa fa-clock-o'></i> about "+Math.ceil(r/483840)+" years ago";
			}
			else
			{
				ret = "<i class='fa fa-clock-o'></i> about a year ago";
			}
		}
	}
	return ret;
}