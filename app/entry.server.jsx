import {PassThrough} from 'stream';
import {renderToPipeableStream} from 'react-dom/server';
import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import {addDocumentResponseHeaders} from './shopify.server';
import {cors} from 'remix-utils/cors';

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Headers', 'X-Requested-With');

  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get('user-agent');
  const callbackName = isbot(userAgent ?? '') ? 'onAllReady' : 'onShellReady';

  return new Promise((resolve, reject) => {
    let didError = false;
    const {pipe, abort} = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [callbackName]: () => {
          let body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');

          cors(
            request,
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
            {origin: true},
          ).then((response) => {
            resolve(response);
          });

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
export let handleDataRequest = async (response, {request}) => {
  return await cors(request, response);
};
