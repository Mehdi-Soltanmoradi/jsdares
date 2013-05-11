/*jshint node:true jquery:true*/
"use strict";

module.exports = function(dares) {
	dares.getContent = function(ui) {
		return {
			tables: [{
				title: 'I',
				dares: [
					new dares.RobotGoalDare({
						name: 'Knight Jump',
						description: '<p>Move the robot to the <strong>green square</strong>. In chess this is known as a <strong>knight jump</strong>.</p>',
						speed: 100,
						maxLines: 5,
						linePenalty: 0,
						goalReward: 50,
						numGoals: 1,
						state: '{"columns":4,"rows":4,"initialX":2,"initialY":2,"initialAngle":90,"mazeObjects":1,"verticalActive":[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],"horizontalActive":[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]],"blockGoal":[[false,false,false,false],[true,false,false,false],[false,false,false,false],[false,false,false,false]],"numGoals":1}',
						original: function(robot) {
							robot.drive(2);
							robot.turnLeft();
							robot.drive(1);
						},
						infoCommandFilter: ['robot.drive', 'robot.turnLeft', 'robot.turnRight']
					}, ui),
					new dares.ConsoleMatchDare({
						name: 'Hello World',
						description: '<p>A classic exercise is the <strong>Hello World program</strong>, which simply requires you to write "Hello World" to the console.</p>',
						speed: 100,
						maxLines: 1,
						linePenalty: 8,
						original: function(anim) {
							anim.push('Hello World\n');
							return anim;
						},
						infoCommandFilter: ['console.log']
					}, ui),
					new dares.ImageMatchDare({
						name: 'Gravity',
						description: '<p>A block is <strong>thrown</strong> in the air and then <strong>accelerates back down</strong>. The position of the block is drawn every few seconds, resulting in the image on the right. Your task is to <strong>copy</strong> this image as good as possible, in as <strong>few lines</strong> of code as you can.</p>',
						threshold: 270000,
						original: function(anim) {
							var drawBlock = function(i) {
								return function(context) {
									context.fillRect(10+i*24, 270+i*-65+i*i*4, 50, 50);
								};
							};
							for (var i=0; i<20; i++) {
								anim.push(drawBlock(i));
							}
							return anim;
						},
						infoCommandFilter: ['jsmm', 'canvas', 'context']
					}, ui),
					new dares.ConsoleMatchDare({
						name: 'Multiplication Tables',
						description: '<p>A <strong>multiplication table</strong> shows the result of multiplying numbers. Your task is to <strong>create</strong> a multiplication table with 10 rows and 5 columns in as <strong>few lines</strong> as code as possible.</p>',
						speed: 100,
						original: function(anim) {
							for (var y=1; y<=10; y++) {
								var text = '';
								for (var x=1; x<=5; x++) {
									text += (x*y) + '\t';
								}
								anim.push(text + '\n');
							}
							return anim;
						},
						infoCommandFilter: ['jsmm', 'console']
					}, ui)
				]
			}]
		};
	};
};
