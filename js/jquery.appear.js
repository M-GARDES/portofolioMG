
(function($) {
	$.fn.appear = function(fn, options) {

		var settings = $.extend({

			//données arbitraires à passer à fn
			data: undefined,

			//appeler fn uniquement lors de la première apparition ?
			one: true,

			// X & Y précision
			accX: 0,
			accY: 0

		}, options);

		return this.each(function() {

			var t = $(this);

			//si l'élément est actuellement visible
			t.appeared = false;

			if (!fn) {

				//déclencher l'événement personnalisé
				t.trigger('appear', settings.data);
				return;
			}

			var w = $(window);

			//déclenche l'événement d'apparition le cas échéant
			var check = function() {

				//est il caché?
				if (!t.is(':visible')) {

					//devenu caché
					t.appeared = false;
					return;
				}

				//l'élément est-il à l'intérieur de la fenêtre visible ?
				var a = w.scrollLeft();
				var b = w.scrollTop();
				var o = t.offset();
				var x = o.left;
				var y = o.top;

				var ax = settings.accX;
				var ay = settings.accY;
				var th = t.height();
				var wh = w.height();
				var tw = t.width();
				var ww = w.width();

				if (y + th + ay >= b &&
					y <= b + wh + ay &&
					x + tw + ax >= a &&
					x <= a + ww + ax) {

					//déclencher l'événement personnalisé
					if (!t.appeared) t.trigger('appear', settings.data);

				} else {

					//défilé hors de vue
					t.appeared = false;
				}
			};

			//créer un fn modifié avec logique supplémentaire
			var modifiedFn = function() {

				//marquer l'élément comme visible
				t.appeared = true;

				//censé n'arriver qu'une fois ?
				if (settings.one) {

					//retirer la vérif
					w.unbind('scroll', check);
					var i = $.inArray(check, $.fn.appear.checks);
					if (i >= 0) $.fn.appear.checks.splice(i, 1);
				}

				//déclencher le fn d'origine
				fn.apply(this, arguments);
			};

			//lier le fn modifié à l'élément
			if (settings.one) t.one('appear', settings.data, modifiedFn);
			else t.bind('appear', settings.data, modifiedFn);

			//vérifier chaque fois que la fenêtre défile
			w.scroll(check);

			//vérifier chaque fois qu'onjet change
			$.fn.appear.checks.push(check);

			//vérifie maintenant
			(check)();
		});
	};

	//garder une file d'attente de vérif d'apparence
	$.extend($.fn.appear, {

		checks: [],
		timeout: null,

		//traiter file d'attente
		checkAll: function() {
			var length = $.fn.appear.checks.length;
			if (length > 0) while (length--) ($.fn.appear.checks[length])();
		},

		//vérifier file d'attente  asynchrone
		run: function() {
			if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
			$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
		}
	});

	//exécuter  vérifications quand méthodes appelées
	$.each(['append', 'prepend', 'after', 'before', 'attr',
		'removeAttr', 'addClass', 'removeClass', 'toggleClass',
		'remove', 'css', 'show', 'hide'], function(i, n) {
		var old = $.fn[n];
		if (old) {
			$.fn[n] = function() {
				var r = old.apply(this, arguments);
				$.fn.appear.run();
				return r;
			}
		}
	});

})(jQuery);