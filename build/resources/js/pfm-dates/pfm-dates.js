// controls the date selection reinitialization of pfm monthly insights tab
$(function(){
	//no month data available
	if( monthData === undefined ) return;

	var pfmDateSelect = $('.pfm-date-selection');
	var currMonth = currSelected = pfmDateSelect.val();
	var pieChartLegend = $('[data-widget-role="pie-chart-legend"]');
	var pieChartItem = '<li><span class="category-spend-amount inactive">%value%</span><span class="category-spend-name">%name%</span></li>';
	var linkedItem = '<li><span class="category-spend-amount inactive">%value%</span><a class="category-spend-name has-caret">%name%</a></li>';

	pfmDateSelect.on("change", dateSelection);

	function dateSelection(){
		if($(this).val() === currSelected){
			return;
		}else{
			reinitData( getMonthData($(this).val()) );
		}
	}

	function getMonthData(monthNum){
		var ob = $.grep(monthData, function(ob){ return ob.month !== undefined && ob.month == monthNum });
		if(ob === undefined || ob.length === 0) return;
		currSelected = monthNum;
		return ob[0];
	}

	function getHighestPercentage(monthOb){
		var total = 0;
		var max = 0;
		var maxOb = null;
		var val;
		for(var i=0; i<monthOb.data.length; i++){
			val = parseInt(monthOb.data[i].value.replace(/\$|,/gi,""));
			total += val;
			if( Math.max(val,max) == val ){
				max = val;
				maxOb = monthOb.data[i];
			}
		}
		return {percent:Math.floor((max/total)*100), name:maxOb.name, total:total.toString()};
	}

	function reinitData(monthOb){
		var elementString = '';
		var templateString = '';

		pieChartLegend.children().remove();

		for(var i=0; i<monthOb.data.length; i++){
			console.log(monthOb.data[i].name, monthOb.data[i].value);

			if (monthOb.data[i].name == "Uncategorized") {
				if (monthOb.data[i].value == "$0") {
					templateString = pieChartItem;
				} else {
					templateString = linkedItem;
				}
			} else {
				templateString = pieChartItem;
			}
			elementString += templateString.replace('%value%', monthOb.data[i].value).replace('%name%', monthOb.data[i].name);
		}

		pieChartLegend.append( $(elementString) );

		var amounts = getHighestPercentage(monthOb);

		var totalFormat = amounts.total.replace(/([0-9]{1,2})([0-9]{3})/, "$1,$2");

		$('[data-widget-property="pie-chart-total"]').text("$"+totalFormat);


		PfmInteraction.Widget.PieChart.init( $('[data-widget-type="pie-chart"]') );

		if (parseInt(amounts.total) === 0 || isNaN(parseInt(amounts.total))){
			$('.spend-callout .callout-body').text("You haven't used your card this month.");
		}	else {
			$('.spend-callout .callout-body').text("You've spent "+amounts.percent+"% in your largest category, "+amounts.name+", this month"  );
		}
	}

});