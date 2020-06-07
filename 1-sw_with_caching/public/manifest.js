// https://developer.mozilla.org/en-US/docs/Web/Manifest


({
    name: "Sweaty - Activity Tracker", // long name of app (e.g. on splashscreen)

    short_name: "Sweaty", // short name of app (e.g. below icon)

    categories: ["books", "education", "medical"], //categories that the application supposedly belongs to. (Standardized categories) https://github.com/w3c/manifest/wiki/Categories

    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7", // represents the International Age Rating Coalition (IARC) certification code of the web application.

    start_url: "/index.html", // which page to load on startup

    scope: ".", // which page are included in PWA experience

    display: "standalone", // should it look like a standalone app or have web app experience

    background_color: "#fff", // backround whilst loading & on splashscreen

    theme_color: "#3F51B5", // theme color (e.g. top bar in task switcher)

    description: "Keep running until you-re super sweaty!", // description (e.g. as favorite)

    dir: "ltr", // read direction of the app

    lang: "en-US", // main language of app

    orientation: "portrait-primary", //set and enforce default orientation

    icons: [], // configure icons

    screenshots: [ //defines an array of screenshots intended to showcase the application. These images are intended to be used by progressive web app stores.
        {
            src: "screenshot1.webp",
            sizes: "1280x720",
            type: "image/webp"
        },
        {
            src: "screenshot2.webp",
            sizes: "1280x720",
            type: "image/webp"
        }
    ],

    prefer_related_applications: true, /* The prefer_related_applications member is a boolean value that specifies that 
    applications listed in related_applications should be preferred over the web application. 
    f the prefer_related_applications member is set to true, the user agent might 
    suggest installing one of the related applications instead of this web app. */

    related_applications: [  // related native apps so user can decide if install native or web app
        {
            platform: "play",
            url: "",
            id: ""
        }
    ]
})