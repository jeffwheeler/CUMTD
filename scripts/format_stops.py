import sys
import re

from BeautifulSoup import BeautifulSoup

def parse_stops(content):
    stops = []
    soup = BeautifulSoup(content)

    href = re.compile(r'sp=([A-Z0-9]+)')
    name = re.compile(r'^([^[]+) \[(MTD[0-9]+)\]')

    for tag in soup.findAll('a'):
        # print tag

        m = name.search(tag.string)
        ident = href.search(tag['href']).group(1)

        json = '{name:"%s", ident:"%s", numeric:"%s"},' % (
            m.group(1).replace(' and ', ' <span class=\\"amp\\">&amp;</span> '),
            ident,
            m.group(2)
        )

        stops.append(json)

    # Remove duplicates
    stops = list(set(stops))
    stops.sort()

    print 'var allStopsBig = [', '\n'.join(stops), ']'

if __name__ == '__main__':
    parse_stops(''.join(sys.stdin.readlines()))

