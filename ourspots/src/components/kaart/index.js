// Het kaartscherm hoeft niet te weten welke kaart eronder zit. Hier valt de
// keuze, op basis van of er een Google-sleutel is ingevuld.

import { gebruiktOpenStreetMap } from '../../kaartProvider';
import NativeKaart from './NativeKaart';
import OpenKaart from './OpenKaart';

const Kaartweergave = gebruiktOpenStreetMap ? OpenKaart : NativeKaart;

export default Kaartweergave;
