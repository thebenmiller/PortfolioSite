var screenAnimations = {

	//activate card
	"screen1" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"}
			}
		},
		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity" : 0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%", "opacity" : 0}
				},
				".navigation" : {
					"animate" : {"opacity" : 0}
				}
			}
		}
	},

	//welcome
	"screen2" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 150,
					"animate" : {"opacity" : 1}
				},
				".ww-card" : {
					"duration" : 400,
					"css" : {"opacity" : 0},
					"delay" : 150,
					"animate" : {"opacity" : 1}
				},
				".ww-shimmers" : {
					"duration" : 550,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				}
			}
		},

		"backin" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 150,
					"animate" : {"opacity" : 1}
				},
				".ww-card" : {
					"duration" : 400,
					"css" : {"opacity" : 0},
					"delay" : 150,
					"animate" : {"opacity" : 1}
				},
				".ww-shimmers" : {
					"duration" : 550,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				}
			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-shimmers" : {
					"animate" : {"opacity" : 0}
				}
			}
		},

		"backout" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-shimmers" : {
					"animate" : {"opacity" : 0}
				}
			}
		}
	},

	//funding
	"screen3" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-funding" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-l-cash" : {
					"duration" : 450,
					"css" : {"opacity" : 0, "left" : "75%"},
					"delay" : 400,
					"animate" : {"opacity":1, "left" : "50%"}
				},
				".ww-r-coin-1" : {
					"duration" : 150,
					"css" : {"opacity" : 0, "margin-top" : "-10px" },
					"delay" : 750,
					"animate" : {"opacity" : 1, "margin-top" : 0}
				},
				".ww-r-coin-2" : {
					"duration" : 150,
					"css" : {"opacity" : 0, "margin-top" : "-20px" },
					"delay" : 650,
					"animate" : {"opacity" : 1, "margin-top" : 0}
				}
			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-l-cash" : {
					"animate" : {"opacity":0, "left" : "75%"}
				},
				".ww-r-coin-1" : {
					"animate" : {"opacity" : 0}
				},
				".ww-r-coin-2" : {
					"animate" : {"opacity" : 0}
				},
				".ww-card-shadow-funding" : {
					"animate" : {"opacity" : 0}
				}

			}
		},

		"backin" : {
			"el" : {
				"css" : {"display" : "block"}
			},
			"children" : {

				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-funding" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-l-cash" : {
					"duration" : 450,
					"css" : {"opacity" : 0, "left" : "75%"},
					"delay" : 400,
					"animate" : {"opacity":1, "left" : "50%"}
				},
				".ww-r-coin-1" : {
					"duration" : 150,
					"css" : {"opacity" : 0, "margin-top" : "-10px" },
					"delay" : 750,
					"animate" : {"opacity" : 1, "margin-top" : 0}
				},
				".ww-r-coin-2" : {
					"duration" : 150,
					"css" : {"opacity" : 0, "margin-top" : "-20px" },
					"delay" : 650,
					"animate" : {"opacity" : 1, "margin-top" : 0}
				}
			}
		},

		"backout" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-l-cash" : {
					"animate" : {"opacity":0, "left" : "75%"}
				},
				".ww-r-coin-1" : {
					"animate" : {"opacity" : 0}
				},
				".ww-r-coin-2" : {
					"animate" : {"opacity" : 0}
				},
				".ww-card-shadow-funding" : {
					"animate" : {"opacity" : 0}
				}

			}
		},
		"more" : {
			"children" : {
				".more-ways" : {
					"css" : {"display" : "inline-block", "opacity" : 0},
					"animate" : {"opacity" : 1}
				}
			}
		},
		"less" : {
			"children" : {
				".more-ways" : {
					"animate" : {"opacity" : 0},
					"cssPost" : {"display" : "none"},
					"duration" : 150
				}
			}
		}
	},

	//direct deposit
	"screen4" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity" : 1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-r-paycheck" : {
					"duration" : 350,
					"css" : {"width" : 0, "opacity" : 1},
					"delay" : 400,
					"animate" : {"width" : "156px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}

			}
		},
		"backin" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity" : 1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-r-paycheck" : {
					"duration" : 350,
					"css" : {"width" : 0, "opacity" : 1},
					"delay" : 400,
					"animate" : {"width" : "156px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}

			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-r-paycheck" : {
					"animate" : {"opacity" : 0}
				}
			}
		},
		"backout" : {
			"el" : {
				"delay" : 500,
				"css" : {"display" : ""}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-r-paycheck" : {
					"animate" : {"opacity" : 0}
				}
			}
		}
	},

	//cash load
	"screen5" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "100%"},
					"delay" : 150,
					"animate" : {"margin-left" : "0%"}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-r-cash" : {
					"duration" : 350,
					"css" : {"width" : 0, "opacity" : 1},
					"delay" : 400,
					"animate" : {"width" : "156px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}

			}
		},
		"backin" : {
			"el" : {
				"css" : {"display" : "block"},
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "-100%", "opacity" : 1},
					"delay" : 150,
					"animate" : {"margin-left" : "0%"}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-default" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-r-cash" : {
					"duration" : 350,
					"css" : {"width" : 0, "opacity" : 1},
					"delay" : 400,
					"animate" : {"width" : "156px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}

			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%"}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-r-cash" : {
					"animate" : {"opacity" : "0"}
				}
			}
		},
		"backout" : {
			"el" : {
				"delay" : 500,
				"css" : {"display" : ""}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-r-cash" : {
					"animate" : {"opacity" : "0"}
				}
			}
		}
	},

	//manage balance
	"screen6" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-alert" : {
					"duration" : 350,
					"css" : {"opacity" : 0, "margin-top" : "20px", "width" : "128px", "height" : "116" },
					"delay" : 400,
					"animate" : {"opacity" : 1, "margin-top" : 0, "width" : "136px", "height" : "124" }
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}
			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-alert" : {
					"animate" : {"opacity" : 0}
				}
			}
		},
		"backout" : {
			"el" : {
				"delay" : 500,
				"css" : {"display" : ""}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"animate" : {"opacity":0}
				},
				".ww-alert" : {
					"animate" : {"opacity" : 0}
				}
			}
		},
		"backin" : {
			"el" : {
				"css" : {"display" : "block"}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-alert" : {
					"duration" : 450,
					"css" : {"opacity" : 0, "margin-top" : "-20px" },
					"delay" : 400,
					"animate" : {"opacity" : 1, "margin-top" : 0}
				}
			}
		},
	},

	//use card
	"screen7" : {
		"in" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-use" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-receipt" : {
					"duration" : 450,
					"css" : {"opacity" : 0, "margin-left" : "60px" },
					"delay" : 400,
					"animate" : {"opacity" : 1, "margin-left" : "34px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}
			}
		},

		"out" : {
			"el" : {
				"delay" : 600,
				"css" : {"display" : "none"}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".actions" : {
					"delay" : 50,
					"animate" : {"margin-left" : "-100%", "opacity":0}
				},
				".navigation" : {
					"delay" : 100,
					"animate" : {"opacity" : 0}
				}
			}
		},
		"backin" : {
			"el" : {
				"css" : {"display" : "block"},
				"animate" : {"opacity":1}
			},
			"children" : {
				".headline" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0", "opacity" : 1}
				},
				".actions" : {
					"css" : {"margin-left" : "-100%", "opacity" : 0},
					"delay" : 150,
					"animate" : {"margin-left" : "0%", "opacity" : 1}
				},
				".navigation" : {
					"css" : {"opacity":0},
					"delay" : 300,
					"animate" : {"opacity":1}
				},
				".ww-card-shadow-use" : {
					"duration" : 150,
					"css" : {"opacity" : 0},
					"delay" : 400,
					"animate" : {"opacity" : 1}
				},
				".ww-receipt" : {
					"duration" : 450,
					"css" : {"opacity" : 0, "margin-left" : "60px" },
					"delay" : 400,
					"animate" : {"opacity" : 1, "margin-left" : "34px"}
				},
				".ww-card" : {
					"css" : {"opacity" : 0},
					"delay" : 550,
					"cssPost" : {"opacity" : 1}
				}
			}
		},
		"backout" : {
			"el" : {
				"delay" : 500,
				"css" : {"display" : ""}
			},
			"children" : {
				".headline" : {
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".actions" : {
					"delay" : 50,
					"animate" : {"margin-left" : "100%", "opacity":0}
				},
				".navigation" : {
					"delay" : 100,
					"animate" : {"opacity" : 0}
				},
				".ww-receipt" : {
					"animate" : {"opacity" : 0}
				}
			}
		}
	}

};