    // Get total number of commits
    fetch('https://api.github.com/repos/Jacques007/Mom-Tablet-Kiosk/commits?per_page=1')
        .then(response => {
            // GitHub returns the total count in the Link header
            const linkHeader = response.headers.get('Link');
            const match = linkHeader ? linkHeader.match(/page=(\d+)>; rel="last"/) : null;
            const commitCount = match ? match[1] : 'unknown';
            
            return fetch('https://api.github.com/repos/Jacques007/Mom-Tablet-Kiosk/commits/main')
                .then(r => r.json())
                .then(data => ({data, commitCount}));
        })
        .then(({data, commitCount}) => {
            const commitDate = new Date(data.commit.author.date).toLocaleDateString();
            document.getElementById('version').innerHTML = 
                `Build #${commitCount} | ${commitDate}`;
        });
