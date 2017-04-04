// (function() {
//     $('main').addClass('js');
//     var contactForm = {
//         container: $('#contact'),

//         config: {
//             effect: 'slideToggle',
//             speed: 500
//         },

//         init: function(config) {
//             $.extend(this.config, config);
//             $('<button></button>', {
//                     text: 'Sign Up'
//                 })
//                 .insertAfter('article:first')
//                 .on('click', this.show)
//         },
//         show: function() {
//             if (contactForm.container.is(':hidden')) {
//                 contactForm.close.call(contactForm.container);
//                 contactForm.container[contactForm.config.effect](contactForm.config.speed);
//             }
//         },
//         close: function() {
//             var $this = $(this); //#contact
//             if ($this.find('span.close').length) return;
//             $('<span class=close>X</span>')
//                 .prependTo(this)
//                 .on('click', function() {
//                     $this[contactForm.config.effect](contactForm.config.speed);
//                 })
//         }
//     };
//     contactForm.init({
//         effect: 'fadeToggle',
//         speed: 200
//     });
// })();