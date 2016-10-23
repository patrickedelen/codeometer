var BackgroundParticles = (function() {

  var canvas = $('#background-particles').get(0),
      ctx = canvas.getContext('2d');

  var particles = {
    nb: 0,
    array: [],
    color: '#000000',
    connectDistance: 75,
    connectColor: '0, 0, 0',
    connectWidth: .1
  };

  var mousePosition = {
    radius: 100
  };

  var init = function() {

    var documentWidth = $(document).width();
    var documentHeight = $(document).height();

    _createParticles();

    $(window).mousemove(function(canvasPosition) {

      mousePosition.x = canvasPosition.pageX;
      mousePosition.y = canvasPosition.pageY - window.scrollY;

    })

    $(window).resize(function() {

      if (documentWidth != $(document).width() || documentHeight != $(document).height()) {

        documentWidth = $(document).width();
        documentHeight = $(document).height();

        _createParticles();

      }

    });

    return 'Initialize Background Particles';

  }

  var _Particle = function(radius, x, y, vx, vy) {

    this.radius = radius;

    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

  }

  _Particle.prototype.update = function() {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = particles.color;
    ctx.fill();

    if (this.x < 0 || this.x > canvas.width) {

      this.vx = - this.vx;

    }

    if (this.y < 0 || this.y > canvas.height) {

      this.vy = - this.vy;

    }

    this.x += this.vx;
    this.y += this.vy;

    for (var i = 0; i < particles.nb; i++) {

      var that = particles.array[i],
          location = Math.sqrt(Math.pow(this.x - mousePosition.x, 2) + Math.pow(this.y - mousePosition.y, 2)),
          distance = Math.sqrt(Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2));

      if (location <= mousePosition.radius && distance <= particles.connectDistance) {

          var connectOpacity = distance / particles.connectDistance;

          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(that.x, that.y);
          ctx.strokeStyle = 'rgba(' + particles.connectColor + ',' + connectOpacity + ')';
          ctx.lineWidth = particles.connectWidth;
          ctx.stroke();

      }

    }

  };

  var _createParticles = function() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles.nb = Math.round((canvas.width * canvas.height) * .0008);
    particles.array = [];

    for (var i = 0; i < particles.nb; i++) {

      var radius = Math.random(),
          x = Math.random() * canvas.width,
          y = Math.random() * canvas.height,
          vx = -.5 + Math.random(),
          vy = -.5 + Math.random();

      var particle = new _Particle(radius, x, y, vx, vy);
      particles.array.push(particle);

    }

    if ($(canvas).hasClass('is-active')) {

      $(canvas).hide().fadeIn(2000);

    }

    else {

      $(canvas).addClass('is-active').fadeIn(2000);

      requestAnimationFrame(_drawParticles);

    }

  }

  var _drawParticles = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.nb; i++) {

      var particle = particles.array[i];
      particle.update();

    }

    requestAnimationFrame(_drawParticles);

  }

  return {
    init: init
  };

})();

BackgroundParticles.init();