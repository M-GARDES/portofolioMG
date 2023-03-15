
$('#mon_compteur').countTo();
(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return $(this).each(function () {
			// définir les options de l'élément actuel
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);

			// combien de fois mettre à jour  valeur et combien incrémenter  valeur à chaque mise à jour
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// références et variables qui changeront à chaque mise à jour
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// si  intervalle existant  trouvé, effacez-le d'abord
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialiser l'élément avec valeur de départ
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// supprime intervalle
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.text(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // nombre commence à..
		to: 0,                 // nombre dois finnir à..
		speed: 1000,           // combien de temps avant nombre prévu
		refreshInterval: 100,  // à quelle frequence element mis à jour
		decimals: 0,           // decimale à afficher
		formatter: formatter,  // gestionnaire pour formater valeur avant rendu
		onUpdate: null,        // méthode de rappel pour chaque fois qu'élément mis à jour
		onComplete: null       // méthode de rappel pour fin de mise à jour d'élément
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));