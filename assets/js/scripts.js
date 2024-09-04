const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const eventId = urlParams.get("eventId");
const clubId = urlParams.get("clubId");

if (!eventId || !clubId) {
    document.querySelector('.hero-container').style.display = 'none';
    document.querySelector('.club-container').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    document.getElementById('error-container').style.display = 'flex';
} else {
    const userEventsUrl = `https://prod-ts-liveliness-server.onrender.com/api/event/admin/${eventId}`;
    const userClubUrl = `https://prod-ts-liveliness-server.onrender.com/api/club/${clubId}`;
    const clubMembersUrl = `https://prod-ts-liveliness-server.onrender.com/api/club/getAllMembers/${clubId}`;
    const clubUrl = `https://prod-ts-liveliness-server.onrender.com/api/post/club/${clubId}`;

    function showShimmer() {
        document.querySelectorAll('h1.content, h2.content, img.content, p.content, div.content').forEach(element => {
            element.classList.add('shimmer-effect');
            if (element.tagName === 'DIV' && element.classList.contains('content')) {
                element.querySelectorAll('*').forEach(child => {
                    child.style.visibility = 'hidden';
                });
            }
        });
        document.getElementById('toggleButton').style.visibility = 'hidden';
    }

    function hideShimmer() {
        document.querySelectorAll('h1.content, h2.content, img.content, p.content, div.content').forEach(element => {
            element.classList.remove('shimmer-effect');
            if (element.tagName === 'DIV' && element.classList.contains('content')) {
                element.querySelectorAll('*').forEach(child => {
                    child.style.visibility = 'visible';
                });
            }
        });
        document.getElementById('toggleButton').style.visibility = 'visible';

    }

    function formatRelativeDate(dateString) {
        const now = new Date();
        const reviewDate = new Date(dateString);
        const diffInTime = now.getTime() - reviewDate.getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

        if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInDays < 30) {
            return `${Math.floor(diffInDays / 7)} weeks ago`;
        } else {
            return `${Math.floor(diffInDays / 30)} months ago`;
        }
    }

    // function initializeSwiper(selector, paginationSelector) {
    //     new Swiper(selector, {
    //         slidesPerView: 'auto',
    //         spaceBetween: 10,
    //         pagination: {
    //             el: paginationSelector
    //         },
    //     });
    // }

    // initializeSwiper('.mySwiper', '.swiper-pagination-1');
    // initializeSwiper('.mySwiper', '.swiper-pagination-2');
    // initializeSwiper('.mySwiper', '.swiper-pagination-3');

    function updateSocialMediaLinks(data) {
        const links = {
            "instagram": document.getElementById('instagramLink'),
            "tikTok": document.getElementById('tiktokLink'),
            "youTube": document.getElementById('youtubeLink'),
            "website": document.getElementById('websiteLink')
        };

        for (const [key, value] of Object.entries(data)) {
            if (value) {
                links[key]?.setAttribute('href', value);
            } else {
                links[key]?.setAttribute('href', '#');
            }
        }
    }

    function displayClubData(clubData, totalMembers) {

        const socialLinks = {
            "instagram": clubData.instagram,
            "tikTok": clubData.tikTok,
            "website": clubData.website,
            "youTube": clubData.youTube
        };
        document.getElementById('join-club').href = clubData.link;
        document.getElementById('share-club').href = clubData.link;
        document.getElementById('events-seeAll').href = clubData.link;
        document.getElementById('members-seeAll').href = clubData.link;
        document.getElementById('join-groupChat').href = clubData.link;

        document.getElementById('club-photo').src = clubData.headerPhoto;
        document.getElementById('club-avatar').src = clubData.avatarPhoto;
        document.getElementById('club-title').textContent = clubData.name;
        document.getElementById('club-cat').textContent = `#${clubData.category}`;
        document.getElementById('club-type').textContent = clubData.type;
        document.getElementById('total-members').textContent = totalMembers;
        document.getElementById('location').textContent = clubData.locationString;

        const userBioElement = document.getElementById('userBio');
        const toggleButton = document.getElementById('toggleButton');
        userBioElement.textContent = clubData.bio;

        updateSocialMediaLinks(socialLinks);

        if (userBioElement.scrollHeight > userBioElement.clientHeight) {
            toggleButton.style.display = 'inline';
        } else {
            toggleButton.style.display = 'none';
        }

        if (totalMembers > 1) {
            document.getElementById('member-text').textContent = 'Members';
        } else {
            document.getElementById('member-text').textContent = 'Member';
        }

        toggleButton.addEventListener('click', () => {
            document.querySelector('.club-desc').classList.toggle('expanded');
            toggleButton.textContent = document.querySelector('.club-desc').classList.contains('expanded') ? 'Show Less' : 'See More';
        });
    }

    function displayEvents(events) {
        const now = new Date();
        const upcomingEvents = events.filter(event => new Date(event.trainingStartDateTime) > now);

        const container = document.getElementById('eventsContainer');
        container.innerHTML = '';
        if (upcomingEvents.length === 0) {
            container.innerHTML = '<p class="upcoming-events">No upcoming events</p>';
            return;
        }

        upcomingEvents.sort((a, b) => new Date(b.trainingStartDateTime) - new Date(a.trainingStartDateTime));
        const firstFourEvents = upcomingEvents.slice(0, 4);

        firstFourEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            const date = new Date(event.trainingStartDateTime);
            const formattedDateParts = {
                weekday: date.toLocaleString("en-US", { weekday: "short" }),
                month: date.toLocaleString("en-US", { month: "long" }),
                day: date.toLocaleString("en-US", { day: "numeric" }),
                time: date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
            };
            const formattedDate = `${formattedDateParts.weekday}, ${formattedDateParts.day} ${formattedDateParts.month} at ${formattedDateParts.time}`;

            eventCard.innerHTML = `
            <img class="event-photo" src="${event.coverPhotoUrl}" alt="${event.title}">
            <div class="event-card-content">
                <h2>${formattedDate}</h2>
                <h1>${event.title}</h1>
                <p>${event.trainingLocationString}</p>
            </div>
            <a href="https://event.linmo.app/?eventId=${event.trainingId}"><img src="./assets/images/plus.svg" alt="More"></a>
        `;

            container.appendChild(eventCard);
        });
    }

    function displayMembers(members) {
        const membersContainer = document.querySelector('.members-content');
        membersContainer.innerHTML = '';

        const maxVisibleMembers = 6;
        const visibleMembers = members.slice(0, maxVisibleMembers);
        const hiddenMembersCount = members.length - visibleMembers.length;

        visibleMembers.forEach(member => {
            const memberCircle = document.createElement('div');
            memberCircle.className = 'member-circle';

            memberCircle.innerHTML = `
            <img src="${member.mainProfilePhoto}" alt="${member.name}">
        `;

            membersContainer.appendChild(memberCircle);
        });

        if (hiddenMembersCount > 0) {
            const memberPlusCircle = document.createElement('div');
            memberPlusCircle.className = 'member-circle member-plus';

            memberPlusCircle.innerHTML = `
            <h2>+${hiddenMembersCount}</h2>
        `;

            membersContainer.appendChild(memberPlusCircle);
        }
    }

    function displayAnnoucements(clubs, events) {
        const lastItem = clubs[clubs.length - 1];
        const annoucementsContainer = document.querySelector('#clubs');
        annoucementsContainer.innerHTML = '';
        const eventLastItem = events[events.length - 1];
        const creator = eventLastItem.creator.name;

        const newClubCard = document.createElement('div');
        newClubCard.classList.add('club-card', 'content');

        newClubCard.innerHTML = `
        <img src="${lastItem.images[0] || 'https://placehold.co/121x121/png?text=Image&font=Inter'}" alt="">
        <div class="club-text">
            <h2>${creator}</h2>
            <p>${lastItem.caption}</p>
        </div>
    `;

        document.getElementById('clubs').appendChild(newClubCard);
    }

    function updateUi(userEvents, userClub, clubMembers, clubs) {
        const totalMembers = clubMembers.data.length;

        // UserData
        displayClubData(userClub.data, totalMembers);

        // UserEvents
        displayEvents(userEvents.data);

        // Members
        displayMembers(clubMembers.data);

        // Annoucements
        displayAnnoucements(clubs.data, userEvents.data);
    }

    async function makeApiRequest(url) {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    showShimmer();

    Promise.all([
        makeApiRequest(userEventsUrl),
        makeApiRequest(userClubUrl),
        makeApiRequest(clubMembersUrl),
        makeApiRequest(clubUrl)
    ])
        .then(([userEvents, userClub, clubMembers, clubData]) => {
            updateUi(userEvents, userClub, clubMembers, clubData);
            hideShimmer();
        })
        .catch(() => {
            hideShimmer();
        });
}
