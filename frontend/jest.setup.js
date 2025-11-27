import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder cho Node < 18
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
