(function() {
    // Здесь описана функциональность главной страницы портфолио
    
    function hideNavOnScroll() {
        var prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
        window.addEventListener('scroll', hide); 
        function hide() {
            var currentScrolPos = window.pageYOffset || document.documentElement.scrollTop;
            var navbar = document.querySelector('.navbar');
            var navbarHeight = navbar.getBoundingClientRect().height;
            if (currentScrolPos > prevScrollPos) {
                navbar.style.top = -navbarHeight + 'px';
            } else {
                navbar.style.top = '';
            }
            prevScrollPos = currentScrolPos;
        }
        
    };
    hideNavOnScroll();

    function toggleNav() {
        var nav = document.querySelector('.navbar__links');
        var icon= document.querySelector('.navbar__icon');

        icon.addEventListener('click', toggle);
        window.addEventListener('scroll', close);
        window.addEventListener('click', tapOutside);

        function toggle() {
            nav.classList.toggle('navbar__links_open');
        }
        function close() {
            if (document.querySelector('.navbar__links_open')) {
                nav.classList.remove('navbar__links_open');
            }
        }
        function tapOutside(e) {
            if (e.target.closest('.navbar')) return;
            close();
        }

    };
    toggleNav();

    // window.addEventListener('resize', function(e) {
    //     console.log(e.target);
    // })

}());