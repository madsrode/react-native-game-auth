package com.reactnativegameauth;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class PlayGamesAuth extends ReactContextBaseJavaModule {
  private static final String LOG_TAG = "PlayGamesAuth";
  private final static int RC_SIGN_IN = 987;

  private Promise _signInWithUIPromise;

  public PlayGamesAuth(ReactApplicationContext reactContext) {
    super(reactContext);
    ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);

        // GamesActivityResultCodes.RESULT_RECONNECT_REQUIRED = 10001
        if (resultCode == 10001) {
          sendAuthStateChangedEvent(getReactApplicationContext(), false);
        }

        if (requestCode == RC_SIGN_IN) {
          GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
          handleSignInActivityResults(result);
        }
      }
    };

    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @ReactMethod
  public void signIn(final Promise promise) {
    if (!this.isSignedIn()) {
      _signInWithUIPromise = promise;
      getCurrentActivity().startActivityForResult(this.getSignInClient().getSignInIntent(), RC_SIGN_IN);
    } else {
      sendAuthStateChangedEvent(getReactApplicationContext(), true);
      promise.resolve(null);
    }
  }

  @ReactMethod
  public void signInSilent(final boolean triggerUISignInIfSilentFails, final Promise promise) {
    this.getSignInClient().silentSignIn().addOnCompleteListener(getCurrentActivity(),
      task -> {
        if (task.isSuccessful()) {
          String sac = task.getResult().getServerAuthCode();
          sendAuthTokenChangedEvent(getReactApplicationContext(), sac);
          sendAuthStateChangedEvent(getReactApplicationContext(), true);
          promise.resolve(null);
        } else if (triggerUISignInIfSilentFails) {
          Log.d(LOG_TAG, "Failed to sign in silently, trying UI.");
          // Player will need to sign-in explicitly via UI
          signIn(promise);
        } else {
          promise.reject(new Exception("Sign In failed"));
        }
      });
  }

  @ReactMethod
  public void signOut(final Promise promise) {
    if (this.isSignedIn()) {
      this.getSignInClient().signOut().addOnCompleteListener(getCurrentActivity(),
        task -> {
          if (task.isSuccessful()) {
            sendAuthStateChangedEvent(getReactApplicationContext(), false);
            promise.resolve(null);
          } else {
            promise.reject(new Exception("Sign out failed"));
          }
        });
    } else {
      promise.resolve(null);
    }
  }

  public boolean isSignedIn() {
    return GoogleSignIn.getLastSignedInAccount(getReactApplicationContext()) != null;
  }

  private GoogleSignInClient getSignInClient() {
    GoogleSignInOptions googleSignInOptions = new GoogleSignInOptions.Builder(
      GoogleSignInOptions.DEFAULT_GAMES_SIGN_IN)
      .requestServerAuthCode(getReactApplicationContext().getString(R.string.auth_server_client_id))
      .build();

    return GoogleSignIn.getClient(getCurrentActivity(), googleSignInOptions);
  }

  private void handleSignInActivityResults(GoogleSignInResult result) {
    if (result.isSuccess()) {
      String sac = result.getSignInAccount().getServerAuthCode();
      sendAuthTokenChangedEvent(getReactApplicationContext(), sac);
      sendAuthStateChangedEvent(getReactApplicationContext(), true);
      _signInWithUIPromise.resolve(null);
    } else {
      _signInWithUIPromise.reject(new Exception("Error in SignIn process: " + result.getStatus().getStatusCode()));
    }
  }

  @Override
  public String getName() {
    return "PlayGamesAuth";
  }

  public final static String AUTH_STATE_CHANGED_EVENT = "AUTH_STATE_CHANGED_EVENT";
  public static final String AUTH_STATE_CHANGED_EVENT_NAME = "AUTH_STATE_CHANGED_EVENT_NAME";
  public final static String AUTH_TOKEN_CHANGED_EVENT = "AUTH_TOKEN_CHANGED_EVENT";
  public static final String AUTH_TOKEN_CHANGED_EVENT_NAME = "AUTH_TOKEN_CHANGED_EVENT_NAME";

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(AUTH_STATE_CHANGED_EVENT, AUTH_STATE_CHANGED_EVENT_NAME);
    constants.put(AUTH_TOKEN_CHANGED_EVENT, AUTH_TOKEN_CHANGED_EVENT_NAME);
    return constants;
  }

  public static void sendAuthStateChangedEvent(final ReactApplicationContext context, final boolean isSignedIn) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(PlayGamesAuth.AUTH_STATE_CHANGED_EVENT_NAME, isSignedIn);
  }

  public static void sendAuthTokenChangedEvent(final ReactApplicationContext context, final String token) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(PlayGamesAuth.AUTH_TOKEN_CHANGED_EVENT_NAME, token);
  }
}
