module.exports = {
	errorM : function (str){
		nString = '<br/><div style="color:#ED050B; font-size:15px; background:#F9B4B0; border-left:#ED050B thick solid; padding:15px; width:100%" align="center"><i class="fa fa-warning"></i> '+str+' </div>';
		return nString;
	},
	succesM : function (str){
		nString = '<br/><div style="color:#2B8E11; font-size:15px; background:#BCF8AD; border-left:#2B8E11 thick solid; padding:15px; width:100%" align="center"><i class="fa fa-check-square-o"></i> '+str+'</div>';
		return nString;
	}
};