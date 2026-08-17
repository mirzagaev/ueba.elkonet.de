<header class="flex flex-wrap flex-row items-center bg-primary text-primary">
    <button class="flex md:hidden ml-3 text-primary items-center p-2 cursor-pointer" type="button" data-drawer-target="ueba-maindrawer" data-drawer-show="ueba-maindrawer" data-drawer-position="left" aria-controls="ueba-maindrawer">
        <svg class="size-7 stroke-primary" stroke-width="0.5"><use xlink:href="#icon-burger"></use></svg>
    </button>

    <a class="w-fit md:mx-6 my-1 bg-opacity-25 bg-white/40 p-2 flex rounded-xl" href="#">
        <img class="h-18" src="{$url_dir}skin/{$site->skin}/img/ELKOnet_Logo_Vector.png" />
    </a>
    
    <!-- drawer component -->
    <div id="ueba-maindrawer" class="max-w-96 absolute left-0 top-0 z-40 pb-11 overflow-y-auto transition-transform -translate-x-full bg-secondary shadow-lg h-screen" tabindex="-1" aria-labelledby="drawer-label" aria-hidden="true">
        
        <div class="flex items-center py-4 px-8 gap-4 bg-subnav" id="avatarButton" type="button" type="button">
            <div>
                <h2 id="drawer-label" class="text-primary text-lg font-semibold leading-7">Ausbildungsportal</h2>
                <p class="text-secondary text-opacity-20 text-sm font-normal leading-snug">ueba.elkonet.de</p>
            </div>
            <div>
                <button type="button" data-drawer-hide="ueba-maindrawer" aria-controls="ueba-maindrawer" data-drawer-position="left" class="text-primary text-sm absolute top-5 right-2 inline-flex items-center justify-center px-2">
                    <svg fill="none" class="size-7 p-1"><use xlink:href="#icon-close"></use></svg>
                    <span class="sr-only">Menü schließen</span>
                </button>
            </div>
        </div>

        <div class="p-6 py-2">
            <ul class="space-y-2 font-medium">
                <li>
                    <a href="#" class="relative flex items-center py-2 px-2.5 text-primary rounded-lg group">
                        <svg class="size-6 fill-primary"><use xlink:href="#icon-ausbildungsnachweis"></use></svg>
                        <span class="flex-1 ms-5 whitespace-nowrap">Ausbildungsnachweis</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="relative flex items-center py-2 px-2.5 text-primary rounded-lg group">
                        <svg class="size-6 fill-primary"><use xlink:href="#icon-info"></use></svg>
                        <span class="flex-1 ms-5 whitespace-nowrap">Hilfe</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="relative flex items-center p-2 text-primary rounded-lg group">
                        <svg class="size-6 stroke-primary" fill="none" stroke-width="1.5"><use xlink:href="#icon-settings"></use></svg>
                        <span class="flex-1 ms-5 whitespace-nowrap">Einstellungen</span>
                    </a>
                </li>
                <li>
                    <a href="dashboard-user.html" class="flex items-center p-2 text-primary rounded-lg group">
                        <svg class="size-6 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><use xlink:href="#icon-login"></use></svg>
                        <span class="flex-1 ms-5 whitespace-nowrap">Einloggen</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="px-6 py-4 bz_info w-full absolute bottom-0 bg-subnav flex items-center gap-4">
            <div>
                <a class="block" href="index.html">
                    <img class="w-20 h-auto" src="{$url_dir}skin/{$site->skin}/img/ELKOnet_Logo_Vector.png" />
                </a>
            </div>
            <div class="leading-snug text-secondary text-xs font-medium">Elektro- und Informationstechnisches Kompetenznetzwerk</div>
        </div>
    </div>

    <div class="flex p-5 ml-auto gap-4 xl:pr-10">
        <button class="flex text-secondary items-center bg-secondary p-3 rounded-full cursor-pointer" onclick="toggleDarkMode()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        </button>

        <button type="button" id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" class="bg-secondary cursor-pointer relative inline-flex items-center px-3 py-2 text-sm font-medium text-center text-secondary rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownNotification" class="z-20 hidden w-full max-w-sm bg-secondary rounded-lg shadow-sm" aria-labelledby="dropdownNotificationButton">
            <div class="block px-4 py-2 font-medium text-center text-primary rounded-t-lg bg-secondary">
                Benachrichtigungen
            </div>
            <div class="bg-primary">
                <a href="#" class="flex px-4 py-3">
                    <div class="shrink-0 relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-secondary rounded-full">
                        <span class="font-medium text-gray-600">JL</span>
                    </div>
                    <div class="w-full ps-3">
                        <div class="text-primary text-sm mb-1.5 ">Die UEBA-Plattform wurde aktualisiert. Wir haben für dich eine neue Anleitung geschrieben.</div>
                        <div class="text-xs text-secondary">vor kurzem</div>
                    </div>
                </a>
            </div>
            <a href="#" class="block py-2 text-sm font-medium text-center text-primary rounded-b-lg bg-secondary">
                <div class="inline-flex items-center">
                <svg class="w-4 h-4 me-2 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                </svg>
                    Alle aufrufen
                </div>
            </a>
        </div>

        <!-- PROFIL -->
        <div class="hidden md:block cursor-pointer">
            <div class="flex items-center gap-4">
                <div class="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-secondary rounded-full">
                    <svg class="size-full bg-transparent text-secondary" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                        <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                    </svg>
                </div>
                
                <div class="font-medium">
                    <a href="dashboard-user.html">Nicht eingeloggt</a>
                    <a href="dashboard-user.html" class="block text-sm text-secondary">ueba.elkonet.de</a>
                </div>
            </div>
        </div>
    </div>
</header>

{if $page->field.type == "modul"}
<!-- MODUL NAVIGATION -->
<nav class="hidden md:block bg-subnav w-full h-auto">
    <div class="grid h-full w-fit grid-cols-5 mx-auto font-medium text-sm md:text-base xl:text-xl">
        <a class="inline-flex flex-col items-center justify-center px-5 dark:hover:bg-neutral-600 hover:bg-neutral-200 group cursor-pointer py-5 pt-3">
            <svg class="fill-primary size-14 xl:size-18 p-4"><use xlink:href="#icon-folder"></use></svg>
            <span>ETE 4/22</span>
        </a>
        <a class="inline-flex flex-col items-center justify-center px-5 dark:hover:bg-neutral-600 hover:bg-neutral-200 group cursor-pointer py-5 pt-3">
            <svg class="fill-primary size-14 xl:size-18 p-4"><use xlink:href="#icon-kundenauftrag"></use></svg>
            <span>Kundenauftrag</span>
        </a>
        <a class="inline-flex flex-col items-center justify-center px-5 dark:hover:bg-neutral-600 hover:bg-neutral-200 group cursor-pointer py-5 pt-3">
            <svg class="fill-primary size-14 xl:size-18 p-4"><use xlink:href="#icon-info"></use></svg>
            <span>Infopool</span>
        </a>
        <a class="inline-flex flex-col items-center justify-center px-5 dark:hover:bg-neutral-600 hover:bg-neutral-200 group cursor-pointer py-5 pt-3">
            <svg class="fill-primary size-14 xl:size-18 p-4"><use xlink:href="#icon-wissenscheck"></use></svg>
            <span>Wissenscheck</span>
        </a>
        <a class="inline-flex flex-col items-center justify-center px-5 dark:hover:bg-neutral-600 hover:bg-neutral-200 group cursor-pointer py-5 pt-3">
            <svg class="fill-primary size-14 xl:size-18 p-4"><use xlink:href="#icon-methodik"></use></svg>
            <span>Methodik</span>
        </a>
    </div>
</nav>
{/if}

<!-- BREADCRUMB -->
<nav class="hidden md:block mx-auto w-fit text-xs py-5 xl:px-20" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
            <a href="index.html" class="inline-flex items-center text-xs font-medium text-primary">Anmeldung</a>
        </li>
        <li>
            <div class="flex items-center">
                <svg class="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="#777777" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <a href="dashboard.html" class="ms-1 text-xs font-medium text-primary md:ms-2">Elektroniker/in Fachrichtung Energie- und Gebäudetechnik</a>
            </div>
        </li>
        <li aria-current="page">
            <div class="flex items-center">
                <svg class="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="#777777" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="ms-1 text-xs font-medium text-secondary md:ms-2">ETE 4/22</span>
            </div>
        </li>
    </ol>
</nav>