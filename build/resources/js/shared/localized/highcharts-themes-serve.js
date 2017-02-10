/* Serve theme for pie chart */
var startingColors = [],
    hoverColors = [];
switch($('[data-widget-type=pie-chart]').find('[data-widget-role=pie-chart-legend]').children().length){
    case 13:
        startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#e8e83a', '#f9d849', '#ffbf07', '#ff9e00', '#ff7f00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#efe98b', '#fee584', '#feda8d', '#fecd92', '#fdbe90', '#fab0c4', '#dedede'];
        break;
    case 12:
        startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#e8e83a', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#efe98b', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
        break;
    case 11:
        startingColors = ['#16669e', '#218ead', '#0ca3aa', '#3aba91', '#8cce54', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#8dd1d4', '#9fdbc8', '#bbe19c', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
        break;
    case 10:
        startingColors = ['#16669e', '#218ead', '#3aba91', '#8cce54', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#bbe19c', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
        break;
    case 9:
        startingColors = ['#16669e', '#218ead', '#3aba91', '#bfe25b', '#f9d849', '#ffbf07', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#d3e99e', '#fee584', '#feda8d', '#fecd92', '#fab0c4', '#dedede'];
        break;
    case 8:
        startingColors = ['#16669e', '#218ead', '#3aba91', '#bfe25b', '#f9d849', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#92c7d5', '#9fdbc8', '#d3e99e', '#fee584', '#fecd92', '#fab0c4', '#dedede'];
        break;
    case 7:
        startingColors = ['#16669e', '#3aba91', '#bfe25b', '#f9d849', '#ff9e00', '#f4608c', '#979797'];
        hoverColors = ['#8bb2cf', '#9fdbc8', '#d3e99e', '#fee584', '#fecd92', '#fab0c4', '#dedede'];
        break;
    default:
        startingColors = ['#16669e', '#8cce54', '#f9d849', '#ff9e00', '#f4608c', '#979797' ];
        hoverColors = ['#8bb2cf', '#bbe19c', '#fee584', '#fecd92', '#fab0c4', '#dedede' ];
        break;
};
Highcharts.pieTheme = {
    colors: startingColors,
    hoverColors: hoverColors
};

Highcharts.borderRadiusStyle = 0;

Highcharts.piePlaceholerTheme = {
    colors: ['#d2e1eb', '#e9f5de', '#fdf7dd', '#ffebd4', '#fce0e8', '#e5e5e5' ]
};

/* Serve theme for column chart */
Highcharts.columnTheme = {
    xAxis: {
        labels: {
            style: {
                color: '#455560',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px'
            }
        },
        lineColor: '#a5a5a5'
    },
    yAxis: {
        labels: {
            style: {
                color: '#455560',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px'
            }
        },
        lineColor: '#a5a5a5',
    },
    tooltip: {
        style: {
            color: '#679ec7',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px'
        }
    },
    plotOptions: {
        series: { 
            color: '#679ec7'
        },
        column: {
            dataLabels: {
                style: {
                    color: '#679ec7',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px'
                }
            }
        }
    },

    //Special colors
    labelColor: '#015ea2',
    inactiveColor: '#d6d6d6'
};